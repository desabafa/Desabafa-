import React, { useState, useCallback } from 'react';
import { t } from '../translations';
import { TIP_TOPICS } from '../constants';
import type { TipTopic } from '../types';
import { Card } from './PostCard';
import { ArticleModal } from './FollowUsModal';
import { generateTipArticle } from '../services/geminiService';
import { LANGUAGES } from '../constants';

interface TipsPageProps {
    language: string;
}

export const TipsPage: React.FC<TipsPageProps> = ({ language }) => {
    const [selectedTopic, setSelectedTopic] = useState<TipTopic | null>(null);
    const [articleContent, setArticleContent] = useState<string | null>(null);
    
    const handleTopicSelect = useCallback(async (topic: TipTopic) => {
        setSelectedTopic(topic);
        setArticleContent(null); // Clear previous content and show loading spinner

        try {
             const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';
             const content = await generateTipArticle(t(topic.nameKey, language), langName);
             setArticleContent(content);
        } catch (error) {
            console.error("Failed to fetch article", error);
            setArticleContent(t('error_fetching_article', language));
        }
    }, [language]);

    const handleCloseModal = () => {
        setSelectedTopic(null);
        setArticleContent(null);
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
             <div className="text-center mb-12">
                 <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">{t('tips_title', language)}</h1>
                 <p className="text-lg text-slate-600 dark:text-slate-300">{t('tips_subtitle', language)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TIP_TOPICS.map(topic => (
                    <Card key={topic.id} onClick={() => handleTopicSelect(topic)} className="text-center">
                        <div className="text-5xl mb-4">{topic.emoji}</div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t(topic.nameKey, language)}</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">{t(topic.descriptionKey, language)}</p>
                    </Card>
                ))}
            </div>
            
            {selectedTopic && (
                <ArticleModal 
                    onClose={handleCloseModal} 
                    language={language}
                    articleContent={articleContent}
                    originalLanguageCode={language} // The article is generated in the current language
                />
            )}

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