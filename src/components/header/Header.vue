<template>
    <header :class="$style.header">
        <h1 :class="$style.title">
            Копеечка
        </h1>
        <Switch />
    </header>
</template>

<script setup lang="ts">
import Switch from '@/components/header/Switch.vue';
</script>

<style lang="scss" module>
    .header {
        display: flex;
        justify-content: center;
        gap: 16px;
        min-height: 60px;
    }

    .title {
        margin-top: -3px;
        padding: 14px 0 0 16px;
        font-size: 28px;
        color: var(--color);
        font-weight: bold;
    }
</style>
