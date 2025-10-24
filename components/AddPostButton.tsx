
import React from 'react';

interface AddPostButtonProps {
    onClick: () => void;
}

export const AddPostButton: React.FC<AddPostButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Adicionar novo desabafo"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </button>
    );
};
