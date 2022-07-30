<template>
  <svg ref="diagram" class="diagram" xmlns="http://www.w3.org/2000/svg" width="90vw" height="30vh">
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
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.addEventListener('click', () => {
                window.open(skill.link, '_blank')?.focus();
            });

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('width', `${width}`);
            const height = Math.floor(diagram.value.clientHeight / 105 * skill.experience);
            rect.setAttribute('height', `${height}`);
            rect.setAttribute('y', `${diagram.value.clientHeight - height}`);
            rect.setAttribute('x', x.toString());

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.textContent = skill.name;

            group.appendChild(rect);
            group.appendChild(text);
            diagram.value.appendChild(group);

            text.setAttribute('y', `${diagram.value.clientHeight - 10}`);
            text.setAttribute('x', (x + width / 2 - text.textLength.baseVal.value / 2).toString());

            x += width + padding;
        }
    }
</script>

<style lang="postcss">
svg.diagram {
  @apply rounded;
  background-color: theme('colors.background.800');

  g {
    @apply hover:fill-background-600 cursor-pointer;
    fill: theme('colors.background.700');

    text {
      pointer-events: none;
      fill: theme('colors.primary.500');
    }
  }
}
</style>
