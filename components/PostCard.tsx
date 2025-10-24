import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    const isClickable = !!onClick;
    const baseClasses = "bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-all duration-300";
    const clickableClasses = isClickable ? "cursor-pointer hover:shadow-xl hover:transform hover:-translate-y-1" : "";

    return (
        <div 
            className={`${baseClasses} ${clickableClasses} ${className}`}
            onClick={onClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={isClickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
        >
            {children}
        </div>
    );
};