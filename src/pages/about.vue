<template>
    <div>
        <h1>{{ t('nav.about') }}</h1>

        <article>
            owo

            <img
                src=""
                alt="">
        </article>

        <div>
            <h2>{{ t('about.socials') }}</h2>
            <div class="flex flex-row flex-wrap md:w-[50vw] mx-auto justify-center gap-6">
                <a href=".">GitHub (hubble459)</a>
                <a href=".">GitHub (quentin-correia)</a>
                <a href=".">GitLab (meep334)</a>
                <a href="https://www.linkedin.com/in/quentin-c-a920b614a">LinkedIn</a>
                <a href="maito:quentinjcorreia@gmail.com">quentinjcorreia@gmail.com</a>
                <div>Discord: hubbie#2021</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { t } = useI18n();
</script>

<style scoped>
</style>
