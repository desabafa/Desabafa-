export const translations: Record<string, Record<string, string>> = {
  'pt': {
    'app_name': 'Desabafa',
    'app_short_description': 'Fala sem filtros. Aqui és ouvido(a).',
    'welcome_message': 'Olá! Eu sou o Desabafa, a tua IA de apoio. Podes falar sobre o que quiseres, com total anonimato. Nada do que disseres será guardado. Estou aqui para te ouvir.',
    'input_placeholder': 'Escreve a tua mensagem...',
    'disclaimer': 'Não sou um substituto para um profissional de saúde mental. As conversas desaparecem quando sais da aplicação.',
  },
  'en': {
    'app_name': 'Desabafa',
    'app_short_description': 'Speak without filters. Here you are heard.',
    'welcome_message': 'Hello! I am Desabafa, your support AI. You can talk about anything you want, with complete anonymity. Nothing you say will be saved. I am here to listen.',
    'input_placeholder': 'Write your message...',
    'disclaimer': 'I am not a substitute for a mental health professional. Conversations disappear when you leave the app.',
  }
};

export const getLanguageName = (code: string): string => {
    try {
        const lang = code.split('-')[0];
        const displayName = new Intl.DisplayNames([lang], { type: 'language' });
        return displayName.of(lang) || 'English';
    } catch (e) {
        return 'English';
    }
}

export const t = (key: string, langCode: string): string => {
  const baseLang = langCode.split('-')[0] as keyof typeof translations;
  
  const langTranslations = translations[baseLang] || translations['en'];
  return langTranslations[key] || translations['en'][key] || key;
};
