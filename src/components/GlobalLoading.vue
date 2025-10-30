<template>
  <v-overlay
    :model-value="loading.isLoading"
    class="d-flex align-center justify-center"
    persistent
  >
    <v-progress-circular indeterminate color="primary" size="64" />
  </v-overlay>
</template>

<script setup lang="ts">
import { useLoadingStore } from "@/stores/loadingStore";
const loading = useLoadingStore();
</script>

<style scoped>
.v-overlay {
  backdrop-filter: blur(3px);
}
</style>