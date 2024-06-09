import { defineStore } from 'pinia';

export const mainStore = defineStore('main', {
    state: () => {
        return {
            isDarkMode: false,
            isSavedDarkMode: false,
        };
    },
});
