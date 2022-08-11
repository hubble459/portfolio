<template>
    <h1>{{ t('nav.settings') }}</h1>
    <hr>
    <h2>{{ t('settings.colour-mode') }}</h2>
    <div class="buttons">
        <button
            type="button"
            :class="{ active: !isDark }"
            @click="isDark = false">
            {{ t('settings.colour-mode-light') }}
        </button>
        <button
            type="button"
            :class="{ active: isDark }"
            @click="isDark = true">
            {{ t('settings.colour-mode-dark') }}
        </button>
    </div>
    <hr>
    <h2>{{ t('settings.language') }}</h2>
    <div class="buttons">
        <button
            v-for="aLocale in availableLocales"
            :key="aLocale"
            type="button"
            :class="{ active: aLocale === locale }"
            @click="changeLocale(aLocale)">
            {{ aLocale }}
        </button>
    </div>
    <hr>
    <h2>{{ t('settings.version') }}</h2>
    <small>{{ VERSION }} (<a
        href="https://gitlab.com/meep334/portfolio/"
        target="_blank"
        rel="noopener noreferrer">gitlab</a>)</small>
    <br>
    <small>{{ t('settings.updated', { datetime: d(BUILD_TIMESTAMP, 'longTime') }) }}</small>
</template>

<script setup lang="ts">
    import { isDark } from '~/logic';

    const VERSION = import.meta.env.VERSION;
    const BUILD_TIMESTAMP = import.meta.env.BUILD_TIMESTAMP;

    const { t, d, availableLocales, locale } = useI18n();

    function changeLocale(aLocale: string) {
        locale.value = aLocale;
        localStorage.setItem('i18n-locale', locale.value);
    }
</script>

<style scoped lang="postcss">
    .buttons {
        @apply flex flex-row flex-wrap justify-center gap-2;
    }

    button {
        @apply
            rounded
            py-2 px-3
            outline-none
            border-none
            font-mono
            font-extrabold
            text-xl;

        &.active {
            background-color: theme('colors.primary.200');
            color: white;
        }
    }
</style>
