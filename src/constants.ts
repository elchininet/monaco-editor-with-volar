export const VUE = 'vue';

export const INITIAL_CODE = `
<template>
    <div>
        {{ hello }}
    </div>
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