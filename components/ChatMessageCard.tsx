
import React from 'react';
import type { ChatMessage } from '../types';
import { t } from '../translations';

const TimeAgo: React.FC<{ timestamp: number, language: string }> = ({ timestamp, language }) => {
    const [timeString, setTimeString] = React.useState('');
    
    React.useEffect(() => {
        const update = () => {
            const date = new Date(timestamp);
            const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
            
            if (seconds < 5) {
                setTimeString(t('time_ago_now', language));
                return;
            }

            let interval = seconds / 31536000;
            const format = (value: number, unit: string) => {
                const rounded = Math.floor(value);
                const key = `time_ago_${unit}${rounded > 1 ? 's' : ''}`;
                return t(key, language);
            }

            if (interval > 1) { setTimeString(format(interval, 'year')); return; }
            interval = seconds / 2592000;
            if (interval > 1) { setTimeString(format(interval, 'month')); return; }
            interval = seconds / 86400;
            if (interval > 1) { setTimeString(format(interval, 'day')); return; }
            interval = seconds / 3600;
            if (interval > 1) { setTimeString(format(interval, 'hour')); return; }
            interval = seconds / 60;
            if (interval > 1) { setTimeString(format(interval, 'minute')); return; }
            setTimeString(format(seconds, 'second'));
        };
        update();
        const intervalId = setInterval(update, 10000);
        return () => clearInterval(intervalId);
    }, [timestamp, language]);

    return <span className="text-xs text-slate-500 dark:text-slate-400">{timeString}</span>;
}

export const ChatMessageCard: React.FC<{ message: ChatMessage, language: string }> = ({ message, language }) => {
    return (
        <div className="flex flex-col items-start gap-2">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 max-w-lg">
                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{message.content}</p>
            </div>
            <TimeAgo timestamp={message.timestamp} language={language} />
        </div>
    );
};
