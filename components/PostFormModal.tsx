import React, { useState, useEffect } from 'react';
import { t } from '../translations';
import { moderateText } from '../services/geminiService';
import { Card } from './PostCard';
import type { PositiveMessage, ReactionType } from '../types';
import { LANGUAGES } from '../constants';

const MESSAGES_STORAGE_KEY = 'somos-desabafa-messages';

const MOCK_MESSAGES: PositiveMessage[] = [
    { id: 'mock-1', content: "Acredita em ti. És mais forte do que pensas.", language: 'pt-PT', createdAt: new Date(Date.now() - 3600 * 1000), reactions: { like: 15, support: 8, insightful: 3 } },
    { id: 'mock-2', content: "It's okay not to be okay. Take your time to heal.", language: 'en-US', createdAt: new Date(Date.now() - 3600 * 5 * 1000), reactions: { like: 22, support: 12, insightful: 5 } },
    { id: 'mock-3', content: "Chaque jour est une nouvelle chance de changer ta vie.", language: 'fr-FR', createdAt: new Date(Date.now() - 3600 * 10 * 1000), reactions: { like: 18, support: 10, insightful: 1 } },
];

const TimeAgo: React.FC<{ date: Date, language: string }> = ({ date, language }) => {
    const [timeString, setTimeString] = useState('');
    
    React.useEffect(() => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        const format = (value: number, unit: string) => {
            const rounded = Math.floor(value);
            return `${rounded} ${t(`time_ago_${unit}${rounded > 1 ? 's' : ''}`, language)}`;
        }
        if (seconds < 60) { setTimeString(t('time_ago_now', language)); return; }
        const minutes = seconds / 60;
        if (minutes < 60) { setTimeString(format(minutes, 'minute')); return; }
        const hours = minutes / 60;
        if (hours < 24) { setTimeString(format(hours, 'hour')); return; }
        const days = hours / 24;
        setTimeString(format(days, 'day'));
    }, [date, language]);

    return <span className="text-xs text-slate-500 dark:text-slate-400">{timeString}</span>;
}

const MessageCard: React.FC<{ message: PositiveMessage; onReact: (id: string, reaction: ReactionType) => void; language: string }> = ({ message, onReact, language }) => (
    <Card className="flex flex-col justify-between h-full">
        <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">"{message.content}"</p>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3 flex justify-between items-center">
             <div className="flex gap-4 text-slate-500 dark:text-slate-400">
                <button onClick={() => onReact(message.id, 'like')} className="flex items-center gap-1 hover:text-red-500 active:scale-125 transition-all">
                    ❤️ <span className="text-sm font-medium">{message.reactions.like}</span>
                </button>
                <button onClick={() => onReact(message.id, 'support')} className="flex items-center gap-1 hover:text-blue-500 active:scale-125 transition-all">
                    🤝 <span className="text-sm font-medium">{message.reactions.support}</span>
                </button>
            </div>
            <TimeAgo date={message.createdAt} language={language} />
        </div>
    </Card>
);

export const SharePage: React.FC<{ language: string }> = ({ language }) => {
    const [messages, setMessages] = useState<PositiveMessage[]>([]);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
            const localMessages: PositiveMessage[] = stored ? JSON.parse(stored).map((m: PositiveMessage) => ({...m, createdAt: new Date(m.createdAt)})) : [];
            setMessages([...localMessages, ...MOCK_MESSAGES].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
        } catch (e) {
            setMessages(MOCK_MESSAGES);
        }
    }, []);

    const handleReaction = (id: string, reaction: ReactionType) => {
        setMessages(messages.map(m => m.id === id ? { ...m, reactions: { ...m.reactions, [reaction]: m.reactions[reaction] + 1 } } : m));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length < 5 || content.trim().length > 150) {
            setError(t('share_form_char_limit_alert', language));
            return;
        }
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const moderationResult = await moderateText(content);
            if (moderationResult.isHarmful) {
                throw new Error(moderationResult.reason || t('moderation_generic_error', language));
            }

            const newMessage: PositiveMessage = {
                id: new Date().toISOString(),
                content,
                language: language,
                createdAt: new Date(),
                reactions: { like: 0, support: 0, insightful: 0 },
            };
            
            setMessages(prev => [newMessage, ...prev]);
            
            const localMessages = messages.filter(m => !m.id.startsWith('mock-'));
            localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([newMessage, ...localMessages]));
            
            setContent('');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : t('moderation_unknown_error', language));
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
             <div className="text-center mb-12">
                 <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">{t('share_title', language)}</h1>
                 <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">{t('share_subtitle', language)}</p>
            </div>

            <Card className="max-w-2xl mx-auto mb-12">
                 <h2 className="text-2xl font-bold text-center mb-4">{t('share_form_title', language)}</h2>
                 <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={t('share_form_placeholder', language)}
                        className="w-full h-28 p-3 bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-teal-500 focus:ring-0 rounded-lg resize-none transition-colors"
                        required
                        minLength={5}
                        maxLength={150}
                    />
                    <div className="flex justify-end items-center mt-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400 mr-4">{content.length} / 150</span>
                        <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait">
                            {isSubmitting ? t('postform_submit_sending', language) : t('share_form_submit_button', language)}
                        </button>
                    </div>
                     {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400"><strong>{t('moderation_rejection_prefix', language)}</strong> {error}</p>}
                     {success && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{t('share_form_success', language)}</p>}
                 </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map(msg => (
                    <MessageCard key={msg.id} message={msg} onReact={handleReaction} language={language} />
                ))}
            </div>

             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};
