<template>
  <div> cherry </div>
</template>


<script setup lang="ts">
import { watch, ref } from 'vue';
const userName = ref('cherry');
watch(userName, () => {
  console.log('watch');
});
</script>

<style scoped>
div {
  color: red;
}
</style>
