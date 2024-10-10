<template>
    <Header />
    <Main />
    <ModalsContainer />
</template>

<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal';
import Header from '@/components/header/Header.vue';
import Main from '@/components/main/Main.vue';
import { useTheme } from '@/shared/theme';

useTheme();
</script>
