type Locale = 'en' | 'es';
export declare function useTranslation(): {
    t: (key: string, params?: Record<string, string | number>) => string;
    locale: Locale;
    changeLocale: (newLocale: Locale) => void;
};
export {};
