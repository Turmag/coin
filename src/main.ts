import { createApp } from 'vue';
import '@/style.scss';
import { router } from '@/router';
import { createPinia } from 'pinia';
const pinia = createPinia();
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';
import App from '@/App.vue';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(FloatingVue);
app.mount('#app');
