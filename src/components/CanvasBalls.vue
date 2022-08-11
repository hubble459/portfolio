<template>
    <div class="relative my-8">
        <canvas
            ref="canvas"
            :width="center * 2"
            :height="center * 2"
            background="red"
            class="!bg-transparent rounded cursor-move"
            @mousedown="startDrag"
            @mouseup="stopDrag"
            @mousemove="onMouseDrag" />
        <form
            class="absolute top-0 left-0 grid grid-cols-2 w-max place-items-start gap-1 text-left"
            @submit.prevent>
            <label>Min Speed:</label>
            <input
                v-model="minSpeed"
                max="500"
                class="w-15"
                step="1"
                type="number">
            <label>Speed Decrease:</label>
            <input
                v-model="speedDecrease"
                max="1"
                class="w-15"
                step="0.001"
                type="number">
            <label>Collision:</label>
            <input
                v-model="collision"
                type="checkbox">
        </form>
    </div>
</template>

<script setup lang="ts">
    import type CanvasItem from '~/type/canvas_item';

    interface Ball {
        item: CanvasItem
        rotation: number
        velocity: number
        radius: number
    }

    const props = defineProps<{
        items: CanvasItem[]
    }>();
    const speedDecrease = ref(0.99);
    const full = Math.PI * 2;
    const balls: Ball[] = [];
    const minSpeed = ref(1);
    const collision = ref(true);
    const minSize = document.body.clientWidth / 50;
    let center = document.body.clientWidth / 2.3;
    let lastDragRadians = 0;
    let dragSpeed = (minSpeed.value / 1000);
    let dragging: undefined | Ball;

    window.addEventListener('resize', () => {
        center = document.body.clientWidth / 2.3;
        resetBalls();
    });

    const canvas = ref<HTMLCanvasElement>(null as any);

    function calcXY(rotation: number, radius: number) {
        return { x: radius * Math.sin(rotation) + center, y: radius * Math.cos(rotation) + center };
    }

    function intersects(ball: Ball, x1: number, y1: number, r1: number) {
        const { x: x2, y: y2 } = calcXY(ball.rotation, ball.radius);
        const dist = Math.hypot(x2 - x1, y2 - y1);
        return dist <= r1 + ball.item.size * minSize;
    }

    function startDrag(event: MouseEvent) {
        const { offsetX: x, offsetY: y } = event;
        lastDragRadians = 0;
        dragging = balls.find(b => intersects(b, x, y, 2));
        if (dragging) {
            dragging.velocity = 0;
        }
    }

    function stopDrag() {
        if (dragging) {
            dragging.velocity = dragSpeed < 0 ? Math.min(dragSpeed, -(minSpeed.value / 1000)) : Math.max(dragSpeed, (minSpeed.value / 1000));
        }
        dragging = undefined;
    }

    function onMouseDrag(event: MouseEvent) {
        if (dragging) {
            const { offsetX: x, offsetY: y } = event;
            let radians = Math.atan2(x - center, y - center);
            if (radians < 0) {
                radians = Math.PI - Math.abs(radians) + Math.PI;
            }
            if (lastDragRadians === 0) {
                lastDragRadians = radians;
            } else {
                dragSpeed = (radians - lastDragRadians);
                lastDragRadians = radians;
            }
            dragging.rotation = radians;
        }
    }

    function resetBalls() {
        balls.length = 0;
        balls.push(...props.items.map((item) => {
            const randomVelocity = Math.floor(Math.random() * 100) / 1000;
            const ballRadius = minSize * item.size;
            const diameter = ballRadius * 2;
            return {
                item,
                rotation: Math.floor(Math.random() * full),
                velocity: Math.random() < 0.5 ? -randomVelocity : randomVelocity,
                radius: Math.floor(Math.random() * (center - diameter * 2)) + diameter,
            };
        }));
    }

    onMounted(() => {
        const ctx = canvas.value.getContext('2d')!;

        if (ctx) {
            resetBalls();

            function onFrame() {
                if (!canvas.value) {
                    return;
                }

                ctx.fillStyle = '#fff';
                ctx.strokeStyle = '#B00B69';
                ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

                for (const ball of balls) {
                    if (ball !== dragging) {
                        ball.rotation += ball.velocity;
                        ball.rotation %= full;
                        if (ball.rotation < 0) {
                            ball.rotation = full - ball.rotation;
                        }
                        ball.velocity = ball.velocity < 0 ? Math.min(ball.velocity * speedDecrease.value, -(minSpeed.value / 1000)) : Math.max(ball.velocity * speedDecrease.value, (minSpeed.value / 1000));
                    }

                    const { x, y } = calcXY(ball.rotation, ball.radius);
                    const ballSize = ball.item.size * minSize;

                    ctx.moveTo(x, y);
                    ctx.lineTo(center, center);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.fillStyle = '#fff';
                    ctx.arc(x, y, ballSize, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#B00B69';
                    let textSize: TextMetrics;
                    let fontSize = 30;
                    do {
                        ctx.font = `bold ${fontSize-- + ball.item.size}px monospace`;
                        textSize = ctx.measureText(ball.item.name);
                    } while (textSize.width * 1.2 > ballSize * 2);
                    ctx.fillText(ball.item.name, x - textSize.width / 2, y + 4);

                    if (collision.value) {
                        const b = balls.find(b => b !== ball && intersects(b, x, y, ballSize));

                        if (b && b !== dragging && ball !== dragging) {
                            const diff = ball.rotation - b.rotation;
                            const right = diff < 0 || diff > 4;
                            const attack = Math.abs(ball.velocity) > Math.abs(b.velocity);

                            if (right) {
                                const vel = Math.abs(ball.velocity);
                                ball.velocity = attack ? -0.01 : -b.velocity;
                                b.velocity = attack ? 0.01 : vel;
                            } else {
                                const vel = -ball.velocity;
                                ball.velocity = attack ? 0.01 : Math.abs(b.velocity);
                                b.velocity = attack ? -0.01 : vel;
                            }
                        }
                    }
                }

                // center
                ctx.beginPath();
                ctx.arc(center, center, 20, 0, 2 * Math.PI);
                ctx.fill();
                requestAnimationFrame(onFrame);
            }

            requestAnimationFrame(onFrame);
        }
    });
</script>

<style scoped>
</style>
