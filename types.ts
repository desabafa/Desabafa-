export interface Language {
    code: string;
    name: string;
    flag: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
