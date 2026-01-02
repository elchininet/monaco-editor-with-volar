export const VUE = 'vue';

export const INITIAL_CODE = `
<template>
    <div>
        {{ hello }}
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    const hello = ref('Hello world!');
</script>
`.trim();