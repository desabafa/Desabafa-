import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Chat } from '@google/genai';

import { LANGUAGES } from './constants';
import { t, getLanguageName } from './translations';
import { createSystemInstruction } from './services/geminiService';
import type { ChatMessage, Language } from './types';

// --- Gemini AI Initialization ---
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
} else {
    if (typeof console !== 'undefined' && console.warn) {
        console.warn("API_KEY is not set. Chatbot will be disabled.");
    }
}

// --- UI Components ---

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isDarkMode = localStorage.getItem('theme') === 'dark' || 
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDark(isDarkMode);
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newIsDark);
    };

    return (
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle theme">
            {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
        </button>
    );
};

const Header: React.FC<{ activeLanguage: string; onLanguageSelect: (code: string) => void; }> = ({ activeLanguage, onLanguageSelect }) => (
    <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t('app_name', activeLanguage)}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('app_short_description', activeLanguage)}</p>
            </div>
            <div className="flex items-center gap-2">
                <select 
                    value={activeLanguage} 
                    onChange={(e) => onLanguageSelect(e.target.value)} 
                    className="text-2xl appearance-none bg-transparent border-none p-1 rounded-md cursor-pointer focus:ring-0"
                    aria-label="Select language"
                >
                    {LANGUAGES.map(lang => <option key={lang.code} value={lang.code} className="text-base">{lang.flag}</option>)}
                </select>
                <ThemeToggle />
            </div>
        </div>
    </header>
);

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl whitespace-pre-wrap shadow ${
            message.role === 'user' 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
        }`}>
            {message.content}
        </div>
    </div>
);

const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-none shadow">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    </div>
);

// --- Main App Component ---

const App: React.FC = () => {
    const [activeLanguage, setActiveLanguage] = useState<string>(() => {
        const browserLang = navigator.language;
        const supportedLang = LANGUAGES.find(l => l.code === browserLang) || LANGUAGES.find(l => l.code.startsWith(browserLang.split('-')[0]));
        return supportedLang ? supportedLang.code : 'en-US';
    });
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const chatSession = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeChat = async () => {
            setIsLoading(true);
            setMessages([]);
            
            if (!ai) {
                setMessages([{ role: 'model', content: "Chatbot is currently unavailable. Please check API key configuration." }]);
                setIsLoading(false);
                return;
            }

            const langName = getLanguageName(activeLanguage);
            const systemInstruction = createSystemInstruction(langName);
            
            chatSession.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });

            setMessages([{ role: 'model', content: t('welcome_message', activeLanguage) }]);
            setIsLoading(false);
        };
        initializeChat();
    }, [activeLanguage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chatSession.current) return;

        const newUserMessage: ChatMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const stream = await chatSession.current.sendMessageStream({ message: currentInput });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <Header activeLanguage={activeLanguage} onLanguageSelect={setActiveLanguage} />
            
            <main className="flex-grow p-4 overflow-y-auto">
                <div className="container mx-auto max-w-3xl space-y-4">
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            
            <footer className="flex-shrink-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
                <div className="container mx-auto max-w-3xl">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={t('input_placeholder', activeLanguage)}
                            className="flex-grow p-3 bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-blue-500 focus:ring-0 rounded-full"
                            disabled={isLoading || !ai}
                            aria-label="Chat input"
                        />
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 px-4">{t('disclaimer', activeLanguage)}</p>
                </div>
            </footer>
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce { animation: bounce 1.2s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default App;
