import React, { useState, useEffect } from 'react';
import { LANGUAGES } from '../constants';
import { t } from '../translations';
import type { Page } from '../types';

interface NavbarProps {
    activePage: Page;
    onPageChange: (page: Page) => void;
    activeLanguage: string;
    onLanguageSelect: (language: string) => void;
}

const Logo: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 12.5c-1.33 0-2.52.31-3.6.85.28.6.66 1.15 1.12 1.63.8-.32 1.66-.5 2.55-.5.83 0 1.61.16 2.33.44.52-.47.95-1.02 1.28-1.64C14.53 12.8 13.29 12.5 12 12.5z"/>
        <path d="M12 7c-1.95 0-3.7.67-5.06 1.8C8.16 10.15 9.99 11 12 11c2.01 0 3.84-.85 5.06-2.2C15.7 7.67 13.95 7 12 7z"/>
    </svg>
);


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
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
        </button>
    );
};

const NavLink: React.FC<{ page: Page; activePage: Page; onPageChange: (page: Page) => void; children: React.ReactNode }> = ({ page, activePage, onPageChange, children }) => {
    const isActive = page === activePage;
    return (
        <button
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
            {children}
        </button>
    );
}


export const Navbar: React.FC<NavbarProps> = ({ activePage, onPageChange, activeLanguage, onLanguageSelect }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md z-40">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => onPageChange('home')} className="flex items-center gap-3">
                        <Logo />
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Somos Desabafa</h1>
                    </button>
                </div>

                <nav className="hidden md:flex items-center gap-2">
                    <NavLink page="home" activePage={activePage} onPageChange={onPageChange}>{t('nav_home', activeLanguage)}</NavLink>
                    <NavLink page="tips" activePage={activePage} onPageChange={onPageChange}>{t('nav_tips', activeLanguage)}</NavLink>
                    <NavLink page="info" activePage={activePage} onPageChange={onPageChange}>{t('nav_info', activeLanguage)}</NavLink>
                    <NavLink page="share" activePage={activePage} onPageChange={onPageChange}>{t('nav_share', activeLanguage)}</NavLink>
                    <NavLink page="about" activePage={activePage} onPageChange={onPageChange}>{t('nav_about', activeLanguage)}</NavLink>
                </nav>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select 
                            value={activeLanguage} 
                            onChange={(e) => onLanguageSelect(e.target.value)} 
                            className="text-2xl appearance-none bg-transparent border-none p-1 rounded-md cursor-pointer focus:ring-0"
                            aria-label="Select language"
                        >
                            {LANGUAGES.map(lang => <option key={lang.code} value={lang.code} className="text-base">{lang.flag}</option>)}
                        </select>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};