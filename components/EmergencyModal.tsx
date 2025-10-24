import React, { useState } from 'react';
import { EMERGENCY_CONTACTS, COUNTRIES } from '../constants';
import { t } from '../translations';

interface InfoPageProps {
    language: string;
}

const getDefaultCountry = (language: string): string => {
    const region = language.split('-')[1];
    if (region === 'PT') return 'PT';
    if (language.startsWith('en')) return 'US';
    return 'EU'; 
}

export const InfoPage: React.FC<InfoPageProps> = ({ language }) => {
    const [activeCountry, setActiveCountry] = useState<string>(() => getDefaultCountry(language));
    
    const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>, contact: string) => {
        e.preventDefault();
        
        if (contact.includes('.')) {
             window.open(`https://${contact}`, '_blank');
             return;
        }

        const numberOnly = contact.replace(/\D/g, '');
        const uri = `tel:${numberOnly}`;

        if (/Mobi/i.test(navigator.userAgent)) {
            window.location.href = uri;
        } else {
            alert(t('emergency_desktop_alert', language));
        }
    };
    
    const activeCountryDetails = COUNTRIES.find(c => c.code === activeCountry) || COUNTRIES[0];
    const countryContacts = EMERGENCY_CONTACTS[activeCountry] || [];

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-4xl mx-auto text-center">
                {/* Header Section */}
                <div>
                    <div className="mx-auto bg-red-100 dark:bg-red-900/50 h-16 w-16 flex items-center justify-center rounded-full mb-4 ring-4 ring-red-200 dark:ring-red-800/60">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">{t('emergency_title', language)}</h1>
                    <p className="mt-3 max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
                        {t('emergency_description', language)}
                    </p>
                </div>
                
                {/* Universal Emergency Button */}
                <a 
                    href="#"
                    onClick={(e) => handleContactClick(e, activeCountryDetails.universalNumber)}
                    className="group my-8 w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-all duration-300 text-center flex flex-col items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                    <span className="block text-sm font-semibold uppercase tracking-wider">{t(activeCountryDetails.universalNumberDescKey, language)}</span>
                    <span className="block text-4xl font-bold tracking-widest">{activeCountryDetails.universalNumber}</span>
                </a>

                {/* Other Contacts Section */}
                <div className="text-left">
                     <h2 className="font-bold text-2xl text-slate-700 dark:text-slate-200 mb-4 text-center">{t('other_support_lines', language)}</h2>
                    
                    <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
                        {COUNTRIES.map(country => (
                            <button
                                key={country.code}
                                onClick={() => setActiveCountry(country.code)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeCountry === country.code ? 'bg-teal-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                {country.flag} {t(country.nameKey, language)}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 pt-4">
                        {countryContacts.map(contact => (
                            <div key={contact.nameKey} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{t(contact.nameKey, language)}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{t(contact.descKey, language)}</p>
                                </div>
                                <a 
                                    href="#"
                                    onClick={(e) => handleContactClick(e, contact.number)}
                                    className="flex-shrink-0 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-100 font-mono font-semibold py-2 px-4 rounded-lg whitespace-nowrap transition-colors text-center"
                                >
                                    {contact.number}
                                </a>
                            </div>
                        ))}
                         {countryContacts.length === 0 && (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-4">{t('no_contacts_found', language)}</p>
                        )}
                    </div>
                </div>
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
