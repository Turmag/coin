<template>
    <Header />
    <Main />
    <ModalsContainer />
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import Header from '@header/Header.vue';
import Main from '@main/Main.vue';
import { useTheme } from '@/shared/useTheme';

useTheme();
</script>
