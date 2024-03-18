export const VUE = 'vue';

export const INITIAL_CODE = `
<template>
    <BuiContainer>
        <div>
            {{ hello }}
        </div>
    </BuiContainer>
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

<style>
    body {
        
    }
</style>
`.trim();