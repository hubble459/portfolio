<template>
    <svg ref="diagram" class="diagram" xmlns="http://www.w3.org/2000/svg" width="90vw" height="350">
        <!-- owo -->
    </svg>
</template>

<script setup lang="ts">
    import type Skill from '~/type/skill__item';

    const props = defineProps<{
        skills: Skill[]
    }>();

    const diagram = ref<SVGElement>(null as any);
    const padding = 10;

    window.addEventListener('resize', redraw);
    onMounted(redraw);

    function redraw() {
        if (!diagram.value) {
            return;
        }
        diagram.value.innerHTML = '';
        let x = padding;
        const width = Math.floor(diagram.value.clientWidth / props.skills.length - padding * 1.15);

        // Draw skills
        for (const skill of props.skills) {
            const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            foreignObject.setAttribute('width', `${width}`);
            const height = Math.floor(diagram.value.clientHeight / 105 * skill.experience);
            foreignObject.setAttribute('height', `${height}`);
            foreignObject.setAttribute('y', `${diagram.value.clientHeight - height}`);
            foreignObject.setAttribute('x', x.toString());

            const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            a.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
            a.setAttribute('href', skill.link);
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
            a.setAttribute('title', skill.lang);
            a.style.width = `${width}px`;
            a.style.height = `${height}px`;
            foreignObject.appendChild(a);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.textContent = skill.name;

            diagram.value.appendChild(foreignObject);
            diagram.value.appendChild(text);

            const textWidth = text.textLength.baseVal.value;

            if (textWidth > width) {
                text.setAttribute('font-size', 'large');
                const vertWidth = text.clientHeight;
                text.setAttribute('writing-mode', 'tb');

                text.setAttribute('y', `${diagram.value.clientHeight - text.textLength.baseVal.value - 10}`);
                text.setAttribute('x', (x + width / 2 - vertWidth / 2).toString());
            } else {
                text.setAttribute('y', `${diagram.value.clientHeight - 10}`);
                text.setAttribute('x', (x + width / 2 - textWidth / 2).toString());
            }

            x += width + padding;
        }
    }
</script>

<style lang="postcss">
svg.diagram {
    @apply rounded bg-light-500 dark:bg-background-800;

    /* g { */

        foreignObject {
            a {
                @apply bg-light-800 hover:bg-light-blue-200
                       dark:bg-background-700 dark:hover:bg-background-600 rounded-t;
                display: block;
            }
        }

        text {
            pointer-events: none;
            fill: theme('colors.primary.500');
        }
    /* } */
}
</style>
