import { createI18n } from 'vue-i18n';
import type { UserModule } from '~/types';

const messages = Object.fromEntries(
    Object.entries(
        import.meta.glob('../../locales/*.y(a)?ml', { eager: true }))
        .map(([key, value]: [string, any]) => {
            const yaml = key.endsWith('.yaml');
            return [key.slice(14, yaml ? -5 : -4), value.default];
        }),
);

export const install: UserModule = ({ app }) => {
    const datetimeFormat: Record<string, Intl.DateTimeFormatOptions> = {
        short: {
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        },
        long: {
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            year: 'numeric',
        },
        longTime: {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    };

    const i18n = createI18n({
        legacy: false,
        locale: localStorage.getItem('i18n-locale') || 'en',
        messages,
        datetimeFormats: Object.fromEntries(Object.keys(messages).map(key => ([key, datetimeFormat]))),
    });

    app.use(i18n);
};
