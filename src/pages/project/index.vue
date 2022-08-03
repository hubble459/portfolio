<template>
    <div>
        <h1>{{ t('nav.projects') }}</h1>
        <hr>
        <div class="flex flex-row flex-nowrap overflow-x-auto gap-4 mx-4 justify-center">
            <div v-for="language in languages" :key="language" :class="language?.toLowerCase()" class="px-2 py-1 rounded">
                {{ language }}
            </div>
        </div>
        <div class="projects">
            <div v-for="repo in repos" :key="repo.id" :class="repo.language?.toLowerCase() || 'unknown'">
                <fa6-brands:github-alt />
                <div class="grid gap-0 h-min">
                    <h2>{{ repo.name }}</h2>
                    <sub>{{ d(repo.created_at, 'date') }}</sub>
                </div>
                <small>{{ repo.description || 'No description' }}</small>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { t, d } = useI18n();

    const knownLanguages = ['rust', 'typescript', 'javascript', 'java'];

    interface Repo {
        git: 'github' | 'gitlab'
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
        created_at: string
        updated_at: string
    }

    const repos = ref<Repo[]>([]);
    const repoURLs = [
        'https://api.github.com/users/hubble459/repos',
        'https://api.github.com/users/quentin-correia/repos',
    ];
    const languages = computed(() => repos.value.reduce((languages, repo) => {
        if (!languages.includes(repo.language)) {
            languages.push(repo.language);
        }
        return languages;
    }, [] as string[]));

    onBeforeMount(async () => {
        const promises: Promise<Response>[] = [];

        for (const url of repoURLs) {
            promises.push(fetch(url, { headers: { Accept: 'application/json' } }));
        }

        const responses = await Promise.all(promises);
        for (const res of responses) {
            if (res.status >= 200 && res.status < 300) {
                const json: Repo[] = await res.json();

                repos.value.push(...json.map((repo) => {
                    repo.git = 'github';
                    repo.language = knownLanguages.includes(repo.language?.toLowerCase()) ? repo.language : 'Unknown';
                    return repo;
                }));
            }
        }
    });
</script>

<style scoped lang="postcss">
    .rust {
        @apply bg-[#a72145] text-white;
    }

    .java {
        @apply bg-[#f89820] text-black;
    }

    .javascript {
        @apply bg-[#F0DB4F] text-black;
    }

    .typescript {
        @apply bg-[#007acc] text-white;
    }

    .unknown {
        @apply bg-light-800 text-black;
    }

    .projects {
        @apply flex flex-row flex-wrap gap-4 justify-center m-4;

        > div {
            @apply cursor-pointer
                grid relative
                rounded p-2 <md:flex-1 md:flex-grow
                text-shadow-sm
                shadow-gray-500 dark:shadow-red-900 shadow-md
                md:min-h-30
                transition-transform;

            svg {
                @apply h-4 absolute top-1 left-1 text-black;
            }

            &:not(.unknown) svg {
                @apply text-white;
            }

            h2 {
                @apply p-0 m-0 z-1;
            }

            small {
                @apply items-center line-clamp-4;
            }

            &:hover {
                @apply transform scale-105 shadow-gray-500 dark:shadow-red-800 shadow-lg dark:shadow-md;
            }
        }
    }
</style>
