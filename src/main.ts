import '@/style.scss';
import 'floating-vue/dist/style.css';
import 'vue-final-modal/style.css';
import { router } from '@/router';
import { createPinia } from 'pinia';
import { createVfm } from 'vue-final-modal';
import { createApp } from 'vue';
import App from '@/App.vue';
import FloatingVue from 'floating-vue';

const vfm = createVfm();
const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(FloatingVue);
app.use(vfm);
app.mount('#app');
