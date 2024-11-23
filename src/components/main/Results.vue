<template>
    <div :class="$style.results">
        <div :class="$style.title">
            Результаты:
        </div>
        <div :class="[$style.result, $style.resultWhite]">
            Белых пешек: {{ whiteCount }}
        </div>
        <div :class="[$style.result, $style.resultBlack]">
            Чёрных пешек: {{ blackCount }}
        </div>
    </div>
</template>

<script setup lang="ts">
interface IProps {
    whiteCount: number;
    blackCount: number;
}

defineProps<IProps>();
</script>

<style lang="scss" module>
    .results {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .title {
        font-size: 20px;
    }

    .result {
        font-size: 24px;
    }

    .resultWhite {
        color: blue;
    }

    .resultBlack {
        color: tomato;
    }
</style>
