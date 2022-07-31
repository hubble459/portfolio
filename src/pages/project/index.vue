<template>
    <div>
        <h1>{{ t('nav.projects') }}</h1>
        <hr>
        <div class="projects" />
    </div>
</template>

<script setup lang="ts">
    const { t } = useI18n();

    interface Repo {
        id: number
        name: string
        owner: {
            login: string
            avatar_url: string
            html_url: string
        }
        html_url: string
        description: string
        fork: boolean
        ssh_url: string
        clone_url: string
        language: string
        default_branch: string
    }

    const repos = ref<Repo[]>([]);
    const repoURLs = [
        'https://api.github.com/users/hubble459/repos',
        'https://api.github.com/users/quentin-correia/repos',
    ];

    onBeforeMount(async () => {
        for (const url of repoURLs) {
            const res = await fetch(url, { headers: { Accept: 'application/json' } });

            if (res.status >= 200 && res.status < 300) {
                const json: Repo[] = await res.json();
                repos.value.push(...json);
            }
        }
    });
</script>

<style scoped lang="postcss">
    .projects {
        @apply flex flex-row flex-wrap;
    }
</style>
