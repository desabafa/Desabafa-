import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-4 border-t-teal-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin"></div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};