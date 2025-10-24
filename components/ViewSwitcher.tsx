import React, { useState, useEffect } from 'react';
import { t } from '../translations';
import { generateMotivationalQuote } from '../services/geminiService';
import { Card } from './PostCard';
import { LoadingSpinner } from './FilterBar';

interface HomePageProps {
    language: string;
}

export const HomePage: React.FC<HomePageProps> = ({ language }) => {
    const [quote, setQuote] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchQuote = async () => {
            setIsLoading(true);
            try {
                const langName = new Intl.DisplayNames([language.split('-')[0]], { type: 'language' }).of(language.split('-')[0]) || 'English';
                const newQuote = await generateMotivationalQuote(langName);
                setQuote(newQuote);
            } catch (error) {
                console.error("Failed to fetch quote", error);
                setQuote(t('error_fetching_quote', language));
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuote();
    }, [language]);


    return (
        <div className="container mx-auto px-4 py-12 text-center animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white leading-tight">
                    {t('home_title', language)}
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    {t('home_subtitle', language)}
                </p>
            </div>
            
            <div className="mt-12">
                <Card className="max-w-2xl mx-auto !bg-teal-50 dark:!bg-slate-800 border border-teal-200 dark:border-teal-900">
                    <h2 className="text-lg font-semibold text-teal-800 dark:text-teal-300 mb-4">{t('home_quote_title', language)}</h2>
                    {isLoading ? <LoadingSpinner /> : (
                         <p className="text-2xl font-medium text-slate-700 dark:text-slate-200 italic">
                           "{quote}"
                         </p>
                    )}
                </Card>
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