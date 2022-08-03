<template>
    <h1>Quentin Correia</h1>
    <h2>
        <a href="https://www.saxion.nl/opleidingen/voltijd/bachelor/hbo-ict" target="_blank" rel="noopener noreferrer">HBO-ICT</a>
        {{ t('home.intro.student') }}
        <a target="_blank" href="https://saxion.nl" rel="noopener noreferrer">Saxion</a>
        {{ t('home.intro.in-enschede') }}
    </h2>
    <hr>
    <div class="flex flex-col">
        <h2>{{ t('home.languages') }}</h2>
        <!-- <sub>{{ t('home.self-made') }}</sub> -->
        <CanvasBalls class="mx-auto" :items="languages" />
    </div>
    <hr>
    <div class="flex flex-col">
        <h2>{{ t('home.frameworks') }}</h2>
        <br>
        <SkillDiagram class="mx-auto" :skills="frameworks" />
    </div>
    <br>
    <br>
    <br>
</template>

<script setup lang="ts">
    import type CanvasItem from '~/type/canvas_item';
    import type Skill from '~/type/skill__item';

    const { t } = useI18n();

    const languages: CanvasItem[] = [
        {
            name: 'Rust',
            size: 3,
        },
        {
            name: 'Java',
            size: 4,
        },
        {
            name: 'TypeScript',
            size: 5,
        },
        {
            name: 'SQL',
            size: 4,
        },
        {
            name: 'C++',
            size: 2,
        },
        {
            name: 'PHP',
            size: 1,
        },
        {
            name: 'Scala',
            size: 2,
        },
        {
            name: 'Dart',
            size: 4,
        },
    ];

    const frameworks: Skill[] = [
        {
            name: 'Laravel',
            experience: 40,
            link: 'https://laravel.com/',
            lang: 'PHP',
        },
        {
            name: 'Svelte',
            experience: 80,
            link: 'https://svelte.dev/',
            lang: 'TypeScript',
        },
        {
            name: 'Vue2/3',
            experience: 90,
            link: 'https://vuejs.org/',
            lang: 'TypeScript',
        },
        {
            name: 'Flutter',
            experience: 100,
            link: 'https://flutter.dev/',
            lang: 'Dart',
        },
        {
            name: 'Android',
            experience: 90,
            link: 'https://developer.android.com/',
            lang: 'Java',
        },
        {
            name: 'React',
            experience: 20,
            link: 'https://reactnative.dev/',
            lang: 'TypeScript',
        },
        {
            name: 'Rocket',
            experience: 60,
            link: 'https://rocket.rs/',
            lang: 'Rust',
        },
        {
            name: 'Express',
            experience: 100,
            link: 'https://expressjs.com/',
            lang: 'TypeScript',
        },
    ];
</script>
