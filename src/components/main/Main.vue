<template>
    <div :class="$style.field">
        <div :class="$style.fieldInner">
            <div :class="coinWrapperClass">
                <div :class="$style.coin">
                    <img :src="coinWhite">
                </div>
                <div :class="$style.coinBack">
                    <img :src="coinBlack">
                </div>
            </div>
            <button :class="buttonClass" @click="activate">
                Подбросить монетку
            </button>
        </div>
        <Results :white-count="whiteCount" :black-count="blackCount" />
    </div>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { useModal } from 'vue-final-modal';
import {
    computed,
    ref,
    useCssModule,
} from 'vue';
import Modal from '@/components/Modal.vue';
import Results from '@main/Results.vue';

const $style = useCssModule();

const [isActivated, toggleActivated] = useToggle();
const isFlipping = ref(false);
const isBlack = ref(false);
const whiteCount = ref(0);
const blackCount = ref(0);

const coinWrapperClass = computed(() => ({
    [$style.coinWrapper]: true,
    [$style.coinWrapperActivated]: isActivated.value,
    [$style.coinWrapperActivatedTails]: isBlack.value,
}));

const buttonClass = computed(() => ({
    [$style.btn]: true,
    [$style.btnDisabled]: isFlipping.value,
}));

const coinWhite = computed(() => new URL('/src/assets/img/pawn-white.png', import.meta.url).href);
const coinBlack = computed(() => new URL('/src/assets/img/pawn-black.png', import.meta.url).href);

const activate = () => {
    toggleActivated(false);
    isFlipping.value = true;
    isBlack.value = false;

    setTimeout(() => {
        const random = Math.random();
        isBlack.value = random < 0.5;

        toggleActivated(true);
    });

    setTimeout(() => {
        isFlipping.value = false;
        isBlack.value ? blackCount.value++ : whiteCount.value++;

        open();
    }, 3000);
};

const { close, open } = useModal({
    attrs: {
        getText: () => isBlack.value ? 'Ты играешь за чёрных!' : 'Ты играешь за белых!',
        onApply() {
            close();
        },
    },
    component: Modal,
});
</script>

<style lang="scss" module>
    .field {
        display: flex;
        justify-content: center;
        gap: 30px;
        width: 100%;
        margin-top: 20px;
    }

    .fieldInner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .coinWrapper {
        position: relative;
        width: 120px;
        height: 120px;
        padding: 10px;
        transform-style: preserve-3d;

        img {
            width: 70px;
            height: 91px;
        }
    }

    .coinWrapperActivated {
        animation: flip-heads 3s;
        animation-fill-mode: forwards;
    }

    .coinWrapperActivatedTails {
        animation-name: flip-tails;
    }

    .coin, .coinBack {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 120px;
        height: 120px;
        padding: 10px;
        border-radius: 50%;
        border: 4px solid;
        transition: transform 1s;
        backface-visibility: hidden;
    }

    .coinBack {
        transform: rotateY(-180deg);
    }

    .btn {
        height: 50px;
        border-radius: 5px;
        border: 1px solid;
        background-color: var(--btn-bg-color);
        color: var(--color);
        font-size: 20px;
        transition: .3s ease;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--btn-bg-color-hover);
        }

        &:active {
            background-color: var(--btn-bg-color-active);
        }
    }

    .btnDisabled {
        pointer-events: none;
        opacity: .7;
    }

    @keyframes flip-tails {
        from {
            transform: rotateY(0deg);
        }

        to {
            transform: rotateY(1620deg);
        }
    }

    @keyframes flip-heads {
        from {
            transform: rotateY(0deg);
        }

        to {
            transform: rotateY(1800deg);
        }
    }
</style>
