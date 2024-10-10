import {
    ref,
    watch,
    watchEffect,
    onMounted, 
} from 'vue';
import { mainStore } from '@/store';

export function useTheme() {
    const store = mainStore();
    const matches = ref(true);

    const setDarkMode = () => {
        document.body.classList.add('dark');
        store.isDarkMode = true;
    };

    const setLightMode = () => {
        document.body.classList.remove('dark');
        store.isDarkMode = false;
    };

    watchEffect(onInvalidate => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        if (media.matches !== matches.value) matches.value = media.matches;

        const onChange = () => matches.value = media.matches;
        media.addEventListener('change', onChange);

        onInvalidate(() => media.removeEventListener('change', onChange));
    });

    watch(
        () => matches.value,
        val => {
            if (!store.isSavedDarkMode) val ? setDarkMode() : setLightMode();
        },
    );

    onMounted(() => {
        let isDarkMode = String(localStorage.getItem('coinDarkMode'));

        if (!['false', 'true'].includes(isDarkMode)) {
            isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches.toString();
        } else {
            store.isSavedDarkMode = true;
        }

        if (isDarkMode === 'true') setDarkMode();
    });
}
