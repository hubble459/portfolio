<template>
    <div class="absolute right-0 top-0 bottom-0 left-0 overflow-hidden pointer-events-none ">
        <nav class="nav-wheel">
            <fontisto-nav-icon-a />
            <div>
                <RouterLink to="/" :title="t('nav.home')">
                    <ci:home-outline />
                </RouterLink>
                <RouterLink to="/project" :title="t('nav.projects')">
                    <ci:window-code-block />
                </RouterLink>
                <RouterLink to="/about" :title="t('nav.about')">
                    <ci:id-card />
                </RouterLink>
                <RouterLink to="/settings" :title="t('nav.settings')">
                    <ci:slider-03 />
                </RouterLink>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
    const { t } = useI18n();
</script>

<style scoped lang="postcss">
    .nav-wheel {
        @apply absolute right-0 top-0 bottom-0 my-auto overflow-hidden
            pointer-events-auto
            grid content-center justify-center
            rounded-1
            transition-all duration-700
            w-20 h-20
            bg-primary-500
            bg-primary-600 shadow-inner;
        transform: translateX(50%);

        &:hover {
            @apply bg-primary-600
            bg-primary-500 shadow-inner;
            transform: translateX(50%) scale(4);

            > svg {
                @apply opacity-0;
                transform: scale(1);
            }

            > div {
                @apply opacity-100;
            }
        }

        > svg {
            @apply transition-all duration-300;
            transform: scale(2);
            opacity: 1;
        }

        > div {
            @apply opacity-0 transition-all duration-1000 ease-out;

            a {
                &.router-link-active svg {
                    @apply text-gray-600 dark:text-gray-200 opacity-50 cursor-auto;
                }

                &:not(.router-link-active):hover svg {
                    @apply text-gray-800 dark:text-gray-400;
                }

                svg {
                    @apply w-3 h-auto absolute transform;
                }
            }

            a:nth-of-type(1) svg {
                @apply top-1 -translate-x-full;
            }

            a:nth-of-type(2) svg {
                @apply left-2 -translate-y-7;
            }

            a:nth-of-type(3) svg {
                @apply left-2;
            }

            a:nth-of-type(4) svg {
                @apply bottom-1 -translate-x-full;
            }
        }
    }
</style>
