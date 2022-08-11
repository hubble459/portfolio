<template>
    <div class="overflow-x-hidden">
        <Transition>
            <div v-if="notificationVisible" class="fixed top-0 z-10 right-0 pt-1 px-2 mt-2 mx-4 flex flex-col justify-between bg-pink-400 rounded overflow-hidden">
                <h2 class="m-0 p-0">
                    {{ notificationText }}
                </h2>
                <div class="m-0 p-0 h-1 w-[140%] bg-secondary-50 dark:bg-white -mx-2 relative" value="10" max="100">
                    <div ref="notificationProgress" class="absolute bg-primary-600 h-1 w-full" />
                </div>
            </div>
        </Transition>

        <h1>{{ t('nav.projects') }}</h1>
        <hr>
        <div class="flex flex-row flex-nowrap overflow-x-auto gap-4 mx-4 md:justify-center scrollbar-thin scrollbar-thinner scrollbar-thumb-primary-50">
            <div v-for="language in languages" :key="language" :class="language?.toLowerCase()" class="px-2 py-1 rounded">
                {{ language }}
            </div>
        </div>
        <div class="projects">
            <div v-for="repo in repos" :id="repo.id.toString()" :key="repo.id" :class="{ [repo.language?.toLowerCase() || 'unknown']: true, active: repo === selected && repo.readme }" @click="select(repo)">
                <div class="grid gap-0 h-min">
                    <h2>{{ repo.name }}</h2>
                    <sub>{{ d(repo.created_at, 'date') }}</sub>
                </div>
                <small>{{ repo.description || 'No description' }}</small>
                <div class="flex flex-row justify-center self-center place-self-center gap-2 actions">
                    <div title="SSH Clone" @click.stop="copy(repo.ssh_url)">
                        <mdi:ssh />
                    </div>
                    <a :href="repo.html_url" title="GitHub" target="_blank" rel="noopener noreferrer" @click.stop>
                        <fa6-brands:github-alt />
                    </a>
                </div>
                <template v-if="repo === selected">
                    <Markdown v-if="repo.readme" class="readme" :source="repo.readme" :html="true" :linkify="true" :typography="true" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Markdown from 'vue3-markdown-it';

    const notificationProgress = ref<HTMLDivElement>(null as any);
    const notificationVisible = ref(false);
    const notificationText = ref('Successfully copied!');
    let notificationHandle: undefined | NodeJS.Timeout;

    const { t, d } = useI18n();

    const knownLanguages = [
        'rust',
        'typescript',
        'javascript',
        'java',
        'dart',
        'c++',
        'html',
    ];

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
        readme?: string
    }

    const repos = ref<Repo[]>([]);
    const selected = ref<Repo>();

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

    async function select(repo: Repo) {
        if (selected.value === repo) {
            selected.value = undefined;
            return;
        }

        selected.value = repo;
        location.hash = repo.id.toString();

        const readme = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/README.md`;

        const res = await fetch(readme);
        if (res.ok) {
            repo.readme = await res.text();
        }
    }

    onBeforeMount(async () => {
        const promises: Promise<Response>[] = [];

        for (const url of repoURLs) {
            promises.push(fetch(url, { headers: { Accept: 'application/json' } }));
        }

        const responses = await Promise.all(promises);
        for (const res of responses) {
            if (res.ok) {
                const json: Repo[] = await res.json();

                repos.value.push(...json.map((repo) => {
                    repo.git = 'github';
                    repo.language = knownLanguages.includes(repo.language?.toLowerCase()) ? repo.language : 'Unknown';
                    return repo;
                }));
            }
        }

        const selected = repos.value.find(repo => repo.id === +location.hash.substring(1));
        if (selected) {
            select(selected).then(() => {
                document.getElementById((selected!.id || 0).toString())?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
            });
        }
    });

    async function copy(text: string) {
        const cb = useClipboard();
        try {
            if (cb.isSupported.value) {
                await cb.copy(text);
                throw new Error(t('global.copied-successfully'));
            } else {
                throw new Error(t('global.clipboard-unsupported'));
            }
        } catch (e) {
            clearTimeout(notificationHandle);

            // Notification
            notificationVisible.value = true;
            notificationText.value = e.message;
            await nextTick();

            notificationHandle = setTimeout(() => {
                notificationProgress.value.style.animation = 'none';
                notificationVisible.value = false;
            }, 1000);
            notificationProgress.value.style.animation = 'loading 1000ms linear';
        }
    }
</script>

<style lang="postcss">
    .rust {
        @apply bg-[#a72145] text-white;
    }

    .java {
        @apply bg-[#f89820] text-black;
    }

    .dart {
        @apply bg-[#40c4ff] text-black;
    }

    .html {
        @apply bg-[#e34c26] text-black;
    }

    .c\+\+ {
        @apply bg-[#044F88] text-white;
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

        .actions {

            svg {
                @apply text-current;
            }

            a {
                color: currentColor;
            }
        }

        > div {
            @apply no-underline
                cursor-pointer
                grid relative
                rounded p-2 <md:flex-1 md:flex-grow
                transition-transform
                md:min-h-30;

            &.active {
                flex-basis: 100%;

                > .readme {
                    @apply border-white relative border-black border w-[calc(100%-2rem)] block relative text-left overflow-auto bg-black rounded
                        px-4 m-0 text-white;

                    > em {
                        @apply absolute left-1 top-1;
                    }

                    code {
                        @apply scrollbar scrollbar-thumb-primary-500;
                        overflow: auto;
                    }
                }
            }

            &:not(.active) {
                @apply text-shadow-sm
                    shadow-gray-500 dark:shadow-red-900 shadow-md;

                &:hover {
                    @apply transform scale-105 shadow-gray-500 dark:shadow-red-800 shadow-lg dark:shadow-md;
                }
            }

            h2 {
                @apply p-0 m-0 z-1;
            }

            small {
                @apply items-center line-clamp-4;
            }
        }
    }

    @keyframes loading {
        from {
            width: 0;
        }

        to {
            width: 100%;
        }
    }

    /* we will explain what these classes do next! */
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.5s ease;
    }

    .v-leave-to {
        opacity: 0;
    }

    .scrollbar-thinner::-webkit-scrollbar {
        width: 8px;
        height: 4px;
    }
</style>
