<template>
  <div
    class="bg-root"
    :class="{ 'is-dark': isDark, 'is-ready': isReady }"
    aria-hidden="true"
  ></div>

  <div class="bg-content">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const isDark = ref(false);
const isReady = ref(false);
let observer: MutationObserver | null = null;

function syncThemeClass() {
  isDark.value = document.documentElement.classList.contains("dark");
}

onMounted(() => {
  syncThemeClass();
  requestAnimationFrame(() => {
    isReady.value = true;
  });

  observer = new MutationObserver(syncThemeClass);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<style scoped>
.bg-content {
  position: relative;
  z-index: 1;
}

.bg-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  contain: paint;
}

.bg-root::before,
.bg-root::after {
  content: "";
  position: absolute;
  inset: 0;
  transition: none;
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat, repeat, repeat, repeat, repeat, no-repeat;
  background-size: cover, cover, cover, cover, cover, cover, 84px 84px, 84px 84px, 160px 160px, 180px 180px, 210px 210px, cover;
  background-position: center, center, center, center, center, center, center, center, 0 0, 22px 14px, 48px 36px, center;
}

.bg-root.is-ready::before,
.bg-root.is-ready::after {
  transition: opacity 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.bg-root::before {
  opacity: 1;
  background-image:
    radial-gradient(78% 70% at 50% 28%, transparent 42%, rgba(18, 24, 32, 0.06) 100%),
    radial-gradient(1120px 720px at 18% 22%, rgba(255, 255, 255, 0.50), transparent 64%),
    radial-gradient(980px 700px at 82% 16%, rgba(132, 182, 238, 0.20), transparent 68%),
    radial-gradient(860px 620px at 48% 86%, rgba(240, 208, 176, 0.20), transparent 72%),
    radial-gradient(760px 520px at 10% 72%, rgba(255, 193, 147, 0.15), transparent 74%),
    radial-gradient(720px 520px at 88% 42%, rgba(125, 209, 246, 0.14), transparent 74%),
    repeating-linear-gradient(to right, rgba(20, 25, 30, 0.045) 0 1px, transparent 1px 84px),
    repeating-linear-gradient(to bottom, rgba(20, 25, 30, 0.045) 0 1px, transparent 1px 84px),
    radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.22) 0 0.6px, transparent 0.8px),
    radial-gradient(circle at 72% 64%, rgba(0, 0, 0, 0.16) 0 0.6px, transparent 0.8px),
    radial-gradient(circle at 40% 80%, rgba(0, 0, 0, 0.11) 0 0.6px, transparent 0.8px),
    linear-gradient(180deg, #f2f0ea 0%, #e7edf3 55%, #f6f1e8 100%);
}

.bg-root::after {
  opacity: 0;
  background-image:
    radial-gradient(80% 72% at 50% 26%, transparent 48%, rgba(0, 0, 0, 0.44) 100%),
    radial-gradient(1180px 760px at 18% 22%, rgba(128, 190, 246, 0.16), transparent 64%),
    radial-gradient(1020px 740px at 82% 16%, rgba(120, 171, 228, 0.16), transparent 68%),
    radial-gradient(900px 680px at 50% 90%, rgba(52, 84, 116, 0.24), transparent 72%),
    radial-gradient(780px 560px at 12% 74%, rgba(255, 183, 136, 0.11), transparent 74%),
    radial-gradient(760px 560px at 88% 44%, rgba(112, 224, 218, 0.11), transparent 74%),
    repeating-linear-gradient(to right, rgba(235, 245, 255, 0.040) 0 1px, transparent 1px 84px),
    repeating-linear-gradient(to bottom, rgba(235, 245, 255, 0.040) 0 1px, transparent 1px 84px),
    radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.18) 0 0.6px, transparent 0.8px),
    radial-gradient(circle at 72% 64%, rgba(0, 0, 0, 0.24) 0 0.6px, transparent 0.8px),
    radial-gradient(circle at 40% 80%, rgba(0, 0, 0, 0.22) 0 0.6px, transparent 0.8px),
    linear-gradient(180deg, #132030 0%, #1a2d43 55%, #20344c 100%);
}

.bg-root.is-dark::before {
  opacity: 0;
}

.bg-root.is-dark::after {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .bg-root.is-ready::before,
  .bg-root.is-ready::after {
    transition-duration: 0ms;
  }
}
</style>
