<template>
    <VueFinalModal
        :class="$style.modal"
        :content-class="$style.content"
        :lock-scroll="false"
        overlay-transition="vfm-fade"
        content-transition="vfm-fade"
    >
        <div :class="$style.title">
            Результат броска
        </div>
        <div :class="$style.context">
            {{ text }}
        </div>
        <div :class="$style.btns">
            <div :class="$style.btn" @click="apply">
                Хорошо
            </div>
        </div>
    </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import { computed } from 'vue';

interface IProps {
    getText: () => string;
}
const props = defineProps<IProps>();

type TEmits = (e: 'apply') => void;
const emits = defineEmits<TEmits>();

const text = computed(() => props.getText() ?? '');

const apply = () => emits('apply');
</script>

<style lang="scss" module>
    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content {
        position: relative;
        overflow: hidden;
        display: flex;
        width: 600px;
        min-height: 100px;
        max-height: 500px;
        padding: 24px;
        border-radius: 15px;
        border: 1px solid var(--border-color);
        background-color: var(--background-color);
        flex-direction: column;
        gap: 16px;

        @media screen and (width <= 600px) {
            width: 380px;
        }
    }

    .title {
        width: 100%;
        text-align: center;
        font-size: 40px;
        line-height: normal;
        color: var(--color);

        @media screen and (width <= 600px) {
            font-size: 32px;
        }
    }

    .context {
        width: 100%;
        text-align: center;
        font-size: 32px;
        line-height: normal;
        color: var(--color);

        @media screen and (width <= 600px) {
            font-size: 32px;
        }
    }

    .btns {
        display: flex;
        justify-content: center;
        gap: 30px;
        width: 100%;

        @media screen and (width <= 600px) {
            gap: 16px;
        }
    }

    .btn {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 200px;
        height: 64px;
        padding: 16px;
        border-radius: 15px;
        background-color: var(--btn-bg-color);
        font-size: 24px;
        line-height: normal;
        color: var(--color);
        transition: 0.3s ease;
        cursor: pointer;
        font-weight: 400;
        user-select: none;

        &:hover {
            background-color: var(--btn-bg-color-hover);
        }

        &:active {
            background-color: var(--btn-bg-color-active);
        }

        @media screen and (width <= 600px) {
            min-width: 170px;
            height: 40px;
            font-size: 20px;
        }
    }
</style>
