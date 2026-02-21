<template>
  <div class="relative">
    <Background />
    <div class="relative">
      <Header />
      <slot />
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
const { theme, initTheme } = useThemeMode();

onMounted(() => {
  initTheme();
});
</script>