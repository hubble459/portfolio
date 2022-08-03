import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import generatedRoutes from 'virtual:generated-pages';
import { setupLayouts } from 'virtual:generated-layouts';
import App from './App.vue';
import 'highlight.js/styles/monokai.css';

// windicss layers
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
// your custom styles here
import './styles/main.css';
// windicss utilities should be the last style import
import 'virtual:windi-utilities.css';
// windicss devtools support (dev only)
import 'virtual:windi-devtools';

const app = createApp(App);

// setup up pages with layouts
const routes = setupLayouts(generatedRoutes);
const router = createRouter({ history: createWebHistory(), routes });
app.use(router);

// install all modules under `modules/`
Object.values(import.meta.glob('./modules/*.ts', { eager: true, import: 'install' })).map((install: any) => install?.({ app, router, routes }));

app.mount('#app');
