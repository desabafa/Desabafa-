import React, { useEffect, useState } from 'react';
import { t } from '../translations';
import { LoadingSpinner } from './FilterBar';
import { translateText } from '../services/geminiService';
import { LANGUAGES } from '../constants';

// This is a simple markdown parser
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    return (
        <div className="prose dark:prose-invert max-w-none text-left">
            {lines.map((line, index) => {
                if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(3)}</h2>;
                }
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-5">{line.substring(2)}</li>;
                }
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};

interface ArticleModalProps {
    onClose: () => void;
    language: string;
    articleContent: string | null;
    originalLanguageCode: string;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ onClose, language, articleContent, originalLanguageCode }) => {
    const [translatedContent, setTranslatedContent] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    
    useEffect(() => {
        setTranslatedContent(null); // Reset translation when content changes
    }, [articleContent]);

    const handleTranslate = async () => {
        if (translatedContent) {
            setTranslatedContent(null);
            return;
        }
        if (!articleContent) return;

        setIsTranslating(true);
        try {
            const targetLanguage = LANGUAGES.find(l => l.code === language)?.name || 'English';
            const translation = await translateText(articleContent, targetLanguage);
            setTranslatedContent(translation);
        } catch (error) {
            console.error(error);
            alert(t('postcard_translation_error', language));
        } finally {
            setIsTranslating(false);
        }
    };

    const needsTranslation = language.split('-')[0] !== originalLanguageCode.split('-')[0];
    const originalLangInfo = LANGUAGES.find(l => l.code === originalLanguageCode);

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={(e) => { if(e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
                 <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        {needsTranslation && (
                            <button onClick={handleTranslate} disabled={isTranslating} className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline disabled:opacity-50 disabled:cursor-wait">
                                {isTranslating ? t('postcard_translating', language) : translatedContent ? `${t('postcard_show_original', language)} (${originalLangInfo?.flag || ''})` : `${t('postcard_translate', language)}`}
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className="text-3xl p-1 leading-none rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">&times;</button>
                </div>
                
                <div className="overflow-y-auto pr-2">
                    {articleContent ? (
                        <SimpleMarkdown content={translatedContent || articleContent} />
                    ) : (
                        <LoadingSpinner />
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};