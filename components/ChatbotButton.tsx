
import React from 'react';

interface ChatbotButtonProps {
    onClick: () => void;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Open chatbot"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9.45 13.63c.2-.2.43-.32.68-.43.25-.11.51-.16.77-.16s.52.05.77.16c.25.11.48.23.68.43.2.2.38.41.52.64.14.23.21.48.21.73s-.07.5-.21.73c-.14.23-.32.44-.52.64-.2.2-.43.32-.68.43-.25.11-.51.16-.77.16s-.52-.05-.77-.16c-.25-.11-.48-.23-.68-.43-.2-.2-.38-.41-.52-.64-.14-.23-.21-.48-.21-.73s.07-.5.21-.73c.14-.23.32-.44.52-.64zm5.1 0c.2-.2.43-.32.68-.43.25-.11.51-.16.77-.16s.52.05.77.16c.25.11.48.23.68.43.2.2.38.41.52.64.14.23.21.48.21.73s-.07.5-.21.73c-.14.23-.32.44-.52.64-.2.2-.43.32-.68.43-.25-.11-.51-.16-.77-.16s-.52-.05-.77-.16c-.25-.11-.48-.23-.68-.43-.2-.2-.38-.41-.52-.64-.14-.23-.21-.48-.21-.73s.07-.5.21-.73c.14-.23.32-.44.52-.64zM9 8c.83 0 1.5-.67 1.5-1.5S9.83 5 9 5s-1.5.67-1.5 1.5S8.17 8 9 8zm6 0c.83 0 1.5-.67 1.5-1.5S15.83 5 15 5s-1.5.67-1.5 1.5S14.17 8 15 8z"/>
            </svg>
        </button>
    );
};
