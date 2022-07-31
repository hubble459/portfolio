<template>
    <h1>{{ t('nav.settings') }}</h1>
    <hr>
    <h2>{{ t('settings.colour-mode') }}</h2>
    <div class="buttons">
        <button type="button" :class="{ active: !isDark }" @click="isDark = false">
            Light Mode
        </button>
        <button type="button" :class="{ active: isDark }" @click="isDark = true">
            Dark Mode
        </button>
    </div>
    <hr>
    <h2>{{ t('settings.language') }}</h2>
    <div class="buttons">
        <button v-for="aLocale in availableLocales" :key="aLocale" type="button" :class="{ active: aLocale === locale }" @click="changeLocale(aLocale)">
            {{ aLocale }}
        </button>
    </div>
</template>

<script setup lang="ts">
    import { isDark } from '~/logic';

    const { t, availableLocales, locale } = useI18n();

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
