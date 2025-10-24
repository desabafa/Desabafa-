import React from 'react';
import { t } from '../translations';
import { SOCIAL_LINKS, SOCIAL_ICONS } from '../constants';
import type { Page } from '../types';

interface FooterProps {
    language: string;
    onPageChange: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onPageChange }) => {
    return (
        <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-inner py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center items-center gap-4 mb-6">
                    {SOCIAL_LINKS.map(link => (
                        <a 
                            key={link.name} 
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.name}
                            className="text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity"
                        >
                           <img 
                                src={SOCIAL_ICONS[link.name]}
                                alt={`${link.name} logo`}
                                className="h-8 w-8 rounded-md object-contain"
                           />
                        </a>
                    ))}
                </div>
                <div className="flex justify-center items-center gap-6 text-sm">
                    <p className="text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} Somos Desabafa</p>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <button onClick={() => onPageChange('about')} className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        {t('nav_about', language