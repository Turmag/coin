<template>
    <Header />
    <Main />
    <ModalsContainer />
</template>

<script setup lang="ts">
import Header from '@/components/header/Header.vue';
import Main from '@/components/main/Main.vue';
import { ModalsContainer } from 'vue-final-modal';
import { useTheme } from '@/assets/js/theme';

useTheme();
</script>
