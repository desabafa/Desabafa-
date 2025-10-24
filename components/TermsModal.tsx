import React from 'react';
import { t } from '../translations';
import { Card } from './PostCard';

interface AboutPageProps {
    language: string;
}


// FIX: The 'language' variable was not in scope. Added it as a prop to be passed down from the parent.
const Section: React.FC<{ titleKey: string; children: React.ReactNode; language: string; }> = ({ titleKey, children, language }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">{t(titleKey, language)}</h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
            {children}
        </div>
    </div>
);

export const AboutPage: React.FC<AboutPageProps> = ({ language }) => {

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">{t('about_title', language)}</h1>
                     <p className="text-lg text-slate-600 dark:text-slate-300">{t('about_subtitle', language)}</p>
                </div>

                <Card className="!p-8">
                    {/* FIX: Pass the language prop to the Section component. */}
                    <Section titleKey="about_mission_title" language={language}>
                        <p>{t('about_mission_body', language)}</p>
                    </Section>

                    {/* FIX: Pass the language prop to the Section component. */}
                    <Section titleKey="about_values_title" language={language}>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <li className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg"><strong>{t('about_value1_title', language)}:</strong> {t('about_value1_body', language)}</li>
                            <li className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg"><strong>{t('about_value2_title', language)}:</strong> {t('about_value2_body', language)}</li>
                            <li className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg"><strong>{t('about_value3_title', language)}:</strong> {t('about_value3_body', language)}</li>
                            <li className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg"><strong>{t('about_value4_title', language)}:</strong> {t('about_value4_body', language)}</li>
                        </ul>
                    </Section>
                    
                     {/* FIX: Pass the language prop to the Section component. */}
                     <Section titleKey="about_privacy_title" language={language}>
                        <p>{t('about_privacy_body', language)}</p>
                    </Section>
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