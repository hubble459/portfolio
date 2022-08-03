import path from 'path';
import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import WindiCSS from 'vite-plugin-windicss';
import VueI18n from '@intlify/vite-plugin-vue-i18n';
import Inspect from 'vite-plugin-inspect';
import { VitePWA } from 'vite-plugin-pwa';

const markdownWrapperClasses = 'prose prose-sm m-auto text-left';
const VERSION = '1.0.5';

export default defineConfig({
    define: {
        'import.meta.env.BUILD_TIMESTAMP': JSON.stringify(Date.now()),
        'import.meta.env.VERSION': JSON.stringify(VERSION),
    },
    resolve: {
        alias: {
            '~/': `${path.resolve(__dirname, 'src')}/`,
            '@/': `${path.resolve(__dirname, 'src', 'components')}/`,
        },
    },
    plugins: [
        Vue({
            include: [/\.vue$/, /\.md$/],
        }),

        // https://github.com/hannoeru/vite-plugin-pages
        Pages({
            extensions: ['vue', 'md'],
        }),

        // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
        Layouts(),

        // https://github.com/antfu/unplugin-auto-import
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                'vue-i18n',
                '@vueuse/head',
                '@vueuse/core',
            ],
            dts: 'src/auto-imports.d.ts',
        }),

        // https://github.com/antfu/unplugin-vue-components
        Components({
            // allow auto load markdown components under `./src/components/`
            extensions: ['vue', 'md'],

            // allow auto import and register components used in markdown
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

            directoryAsNamespace: true,
            globalNamespaces: ['partial'],

            // custom resolvers
            resolvers: [
                // auto import icons
                // https://github.com/antfu/unplugin-icons
                IconsResolver({
                    componentPrefix: '',
                    prefix: '',
                }),
            ],

            dts: 'src/components.d.ts',
        }),

        // https://github.com/antfu/unplugin-icons
        Icons(),

        // https://github.com/antfu/vite-plugin-windicss
        WindiCSS({
            safelist: markdownWrapperClasses,
        }),

        // https://github.com/antfu/vite-plugin-pwa
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
            manifest: {
                name: 'Quentin Correia',
                short_name: 'QC',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),

        // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
        VueI18n({
            runtimeOnly: true,
            compositionOnly: true,
            include: [path.resolve(__dirname, 'locales/**')],
        }),

        // https://github.com/antfu/vite-plugin-inspect
        Inspect({
            // change this to enable inspect for debugging
            enabled: false,
        }),
    ],

    server: {
        fs: {
            strict: true,
        },
        host: '0.0.0.0',
    },

    optimizeDeps: {
        include: [
            'vue',
            'vue-router',
            '@vueuse/core',
            '@vueuse/head',
        ],
        exclude: [
            'vue-demi',
        ],
    },

    test: {
        dir: 'test',
        environment: 'happy-dom',
    },
});
