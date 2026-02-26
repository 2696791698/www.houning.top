<template>
  <ClientOnly>
    <OverlayScrollbarsComponent defer class="h-screen">
      <div class="relative">
        <Background />
        <div class="relative">
          <Header />
          <div class="relative">
            <slot />
          </div>
          <Footer />
        </div>
      </div>
    </OverlayScrollbarsComponent>
  </ClientOnly>
</template>

<script setup lang="ts">
import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

const { theme, initTheme } = useThemeMode();

onMounted(() => {
  initTheme();
});
</script>