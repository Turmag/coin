<template>
    <Header />
    <Main />
</template>

<script setup lang="ts">
import Header from '@/components/header/Header.vue';
import Main from '@/components/main/Main.vue';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { mainStore } from '@/store/index';
import { useTheme } from '@/assets/js/theme';

const route = useRoute();
const store = mainStore();

useTheme();

watch(
    () => route.query.isAll,
    val => store.isAllItems = Boolean(val),
);
</script>
