<script setup lang="ts">
import { GooeyToaster, gooeyToast } from "goey-toast-vue";

function showToast() {
    gooeyToast.success("121");
}
</script>

<template>
    <GooeyToaster />
    <div>Demo loading...</div>
    <div>
        <button @click="showToast">测试 toast</button>
    </div>
</template>
