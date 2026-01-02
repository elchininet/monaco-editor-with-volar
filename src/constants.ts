export const VUE = 'vue';

export const INITIAL_CODE = `
<template>
    {{ hello }}
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'Test',
        data() {
            return {
                hello: 'Hello World!'
            };
        }
    });
</script>
`.trim();