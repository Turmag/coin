<template>
    <div :class="$style.switchWrapper">
        <div :class="$style.switch">
            <label :class="$style.label">
                <input
                    :class="$style.input"
                    type="checkbox"
                    :checked="!isDarkMode"
                    @change="toggle"
                >
                <span :class="$style.slider" />
            </label>
        </div>
        <IconBase
            v-if="isSavedDarkMode"
            v-tooltip="'Вернуться к системной теме'"
            :class="$style.themeReset"
            width="10"
            height="10"
            viewBoxWidth="1920"
            viewBoxHeight="1920"
            style="min-width: 15px;"
            @click="resetStorageDarkMode"
        >
            <Reset />
        </IconBase>
    </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import Reset from '@/assets/icons/Reset.vue';
import IconBase from '@/components/IconBase.vue';

const isDarkMode = useStorage('isDarkModeCoin', false);
const isSavedDarkMode = useStorage('isSavedDarkModeCoin', false);

const toggle = () => {
    const bodyClass = document.body.classList;
    bodyClass.contains('dark') ? bodyClass.remove('dark') : bodyClass.add('dark');
    isDarkMode.value = bodyClass.contains('dark');
    isSavedDarkMode.value = true;
};

const resetStorageDarkMode = () => {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.value ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    isSavedDarkMode.value = false;
};
</script>

<style lang="scss" module>
    .switchWrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        padding-bottom: 5px;
    }

    .switch {
        position: relative;
        width: 44px;
    }

    .label {
        display: block;
        width: 44px;
        height: 22px;
        border-radius: 50px;
        background-color: var(--color);
        cursor: pointer;
        user-select: none;
    }

    .input {
        position: absolute;
        display: none;
    }

    .slider {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50px;
        transition: 0.3s;
    }

    .slider::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        box-shadow: inset 4px -1px 0 0 var(--background-color);
        background-color: var(--color);
        transition: 0.3s;
    }

    input:checked ~ .slider::before {
        background-color: var(--background-color);
        transform: translateX(22px);
        box-shadow: none;
    }

    .themeReset {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        color: var(--color);
        outline: none;
        cursor: pointer;
        user-select: none;
    }
</style>
