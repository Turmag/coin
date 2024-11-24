import {
    ref,
    watch,
    watchEffect,
    onMounted,
} from 'vue';
import { useStorage } from '@vueuse/core';

export function useTheme() {
    const isDarkMode = useStorage('isDarkModeCoin', false);
    const isSavedDarkMode = useStorage('isSavedDarkModeCoin', false);
    const matches = ref(true);

    const setDarkMode = () => {
        document.body.classList.add('dark');
        isDarkMode.value = true;
    };

    const setLightMode = () => {
        document.body.classList.remove('dark');
        isDarkMode.value = false;
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
        value => {
            if (!isSavedDarkMode.value) value ? setDarkMode() : setLightMode();
        },
    );

    onMounted(() => {
        if (!isSavedDarkMode.value) {
            isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        if (isDarkMode.value) setDarkMode();
    });
}
