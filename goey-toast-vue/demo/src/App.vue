<script setup lang="ts">
import { GooeyToaster, gooeyToast } from "goey-toast-vue";

function showSimple() {
    gooeyToast.success("Saved!");
}

function showWithDescription() {
    gooeyToast.error("Payment failed", {
        description: "Your card was declined. Please try again.",
    });
}

function showWithAction() {
    gooeyToast.info("Share link ready", {
        description: "Your link has been generated.",
        action: {
            label: "Copy to Clipboard",
            onClick: () => console.log("copied"),
            successLabel: "Copied!",
        },
    });
}

function showWarning() {
    gooeyToast.warning("Low disk space", {
        description: "Only 2 GB remaining on your drive.",
    });
}
</script>

<template>
    <GooeyToaster position="top-center" show-progress close-button="top-right" />
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 8px; max-width: 300px">
        <h2>goey-toast-vue Demo</h2>
        <button @click="showSimple">Simple toast</button>
        <button @click="showWithDescription">With description</button>
        <button @click="showWithAction">With action</button>
        <button @click="showWarning">Warning</button>
    </div>
</template>
