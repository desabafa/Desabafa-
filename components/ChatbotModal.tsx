
import React, { useState, useRef, useEffect } from 'react';
import type { AuraChatMessage } from '../types';
import { ai, CHATBOT_SYSTEM_INSTRUCTION } from '../services/geminiService';
import { t } from '../translations';
import type { Chat } from '@google/genai';

interface ChatbotModalProps {
    onClose: () => void;
    language: string;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
);

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ onClose, language }) => {
    const [messages, setMessages] = useState<AuraChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ai) {
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: CHATBOT_SYSTEM_INSTRUCTION },
            });
            setChat(chatSession);
            setMessages([
                { role: 'model', content: t('chatbot_welcome_message', language) }
            ]);
        } else {
             setMessages([
                { role: 'model', content: "Chatbot is currently unavailable. Please check API key configuration." }
            ]);
        }
    }, [language]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const newUserMessage: AuraChatMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: userInput });
            
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
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={(e) => { if(e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg h-[80vh] max-h-[700px] flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">{t('chatbot_title', language)}</h2>
                    <button onClick={onClose} className="text-3xl p-1 leading-none rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">&times;</button>
                </div>

                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-none">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                
                 {/* Disclaimer */}
                <div className="flex-shrink-0 p-2 text-center border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('chatbot_disclaimer', language)}</p>
                </div>

                {/* Input Form */}
                <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={t('chatbot_placeholder', language)}
                            className="flex-grow p-3 bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-teal-500 focus:ring-0 rounded-full"
                            disabled={isLoading || !ai}
                        />
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
                .animate-bounce { animation: bounce 1s infinite ease-in-out; }
            `}</style>
        </div>
    );
};
