<template>
    <header :class="$style.header">
        <h1 :class="$style.title">
            Монет<a href="https://focusinfo.ru/mpstats-coin/">
                о
            </a>чка
        </h1>
        <Switch />
    </header>
</template>

<script setup lang="ts">
import Switch from '@header/Switch.vue';
</script>

<style lang="scss" module>
    .header {
        display: flex;
        justify-content: center;
        gap: 16px;
        min-height: 60px;
    }

    .title {
        display: flex;
        margin-top: -3px;
        padding: 14px 0 0 16px;
        font-size: 28px;
        color: var(--color);
        font-weight: bold;

        a {
            font-weight: 700;
        }
    }
</style>
