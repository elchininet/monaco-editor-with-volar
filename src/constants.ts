export const VUE = 'vue';

export const INITIAL_CODE = `
<template>
    {{ hello }}
</template>

<script>
    export default {
        name: 'Test',
        data() {
            return {
                hello: 'Hello World!'
            };
        }
    }
</script>
`.trim();