'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslation = useTranslation;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const en_1 = require("@/locales/en");
const es_1 = require("@/locales/es");
const DEFAULT_LOCALE = 'es';
function useTranslation() {
    const [locale, setLocale] = (0, react_1.useState)(DEFAULT_LOCALE);
    const pathname = (0, navigation_1.usePathname)();
    (0, react_1.useEffect)(() => {
        const envLocale = process.env.NEXT_PUBLIC_LANGUAGE || DEFAULT_LOCALE;
        const browserLocale = typeof window !== 'undefined' && navigator.language.split('-')[0];
        setLocale(envLocale || browserLocale || DEFAULT_LOCALE);
    }, []);
    const translations = {
        en: en_1.default,
        es: es_1.default,
    };
    const t = (key, params) => {
        let translation = translations[locale][key] || key;
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                translation = translation.replace(`{${paramKey}}`, String(paramValue));
            });
        }
        return translation;
    };
    const changeLocale = (newLocale) => {
        if (newLocale !== locale && (newLocale === 'en' || newLocale === 'es')) {
            setLocale(newLocale);
            if (typeof window !== 'undefined') {
                localStorage.setItem('locale', newLocale);
            }
        }
    };
    return {
        t,
        locale,
        changeLocale,
    };
}
//# sourceMappingURL=useTranslation.js.map