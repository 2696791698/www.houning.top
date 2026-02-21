<template>
  <div class="bg-root" aria-hidden="true">
    <!-- Light -->
    <div class="layer light" :class="{ show: !isDark }">
      <div class="base"></div>
      <div class="mist"></div>
      <div class="sheen"></div>
      <div class="grid"></div>
      <div class="noise"></div>
      <div class="vignette"></div>
    </div>

    <!-- Dark -->
    <div class="layer dark" :class="{ show: isDark }">
      <div class="base"></div>
      <div class="mist"></div>
      <div class="sheen"></div>
      <div class="grid"></div>
      <div class="noise"></div>
      <div class="vignette"></div>
    </div>
  </div>

  <div class="bg-content">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const isDark = ref(false);
let observer: MutationObserver | null = null;

function sync() {
  isDark.value = document.documentElement.classList.contains("dark");
}

onMounted(() => {
  sync();
  observer = new MutationObserver(sync);
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
}

/* ---------- 核心：两层交叉淡入淡出，保证“颜色渐变过去” ---------- */
.layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 800ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: opacity;
}
.layer.show {
  opacity: 1;
}

/* ---------- Light 主题变量（雾白、奶油灰） ---------- */
.light {
  --bgA: #f2f0ea;
  --bgB: #e7edf3;
  --bgC: #f6f1e8;

  --mist1: rgba(255, 190, 150, 0.14);
  --mist2: rgba(140, 190, 255, 0.12);
  --mist3: rgba(120, 220, 210, 0.10);

  --grid: rgba(20, 25, 30, 0.055);
  --vignette: rgba(20, 25, 30, 0.055);
  --noiseOpacity: 0.05;

  /* 更新：两束不同色温的丝绸反光 */
  --sheenA: rgba(255, 255, 255, 0.55);
  --sheenB: rgba(255, 235, 220, 0.35);
  --sheen2: rgba(255, 255, 255, 0.0);
}

/* ---------- Dark 主题变量（深海雾面：统一结构、低饱和高级感） ---------- */
.dark {
  /* 底色：石墨蓝黑（不发紫） */
  --bgA: #0b111a;
  --bgB: #0f1b2a;
  --bgC: #0c1522;

  /* 雾：仍然是暖/冷/青，低对比更“雾面” */
  --mist1: rgba(255, 190, 150, 0.06);
  --mist2: rgba(120, 195, 255, 0.10);
  --mist3: rgba(110, 235, 215, 0.08);

  /* 细网格与暗角 */
  --grid: rgba(235, 245, 255, 0.032);
  --vignette: rgba(0, 0, 0, 0.62);

  /* 噪点：深色稍微多一点才有“雾面” */
  --noiseOpacity: 0.085;

  /* 丝绸反光：冷光为主 + 一点点暖边（更贵） */
  --sheenA: rgba(205, 235, 255, 0.18);
  --sheenB: rgba(255, 210, 185, 0.10);
  --sheen2: rgba(0, 0, 0, 0.0);
}

/* ---------- 1) 底色：多层渐变，做“雾面底” ---------- */
.base {
  position: absolute;
  inset: -25%;
  background:
    radial-gradient(1200px 800px at 18% 22%, var(--bgC), transparent 62%),
    radial-gradient(1000px 700px at 82% 18%, var(--bgB), transparent 62%),
    radial-gradient(900px 700px at 50% 92%, var(--bgB), transparent 58%),
    linear-gradient(180deg, var(--bgA), var(--bgA));
}

/* 深色：额外加一点空间感（顶部冷亮、底部更压） */
.dark .base {
  background:
    radial-gradient(1200px 800px at 18% 22%, var(--bgC), transparent 62%),
    radial-gradient(1000px 700px at 82% 18%, var(--bgB), transparent 62%),
    radial-gradient(900px 700px at 50% 92%, var(--bgB), transparent 58%),
    radial-gradient(1100px 720px at 55% 6%, rgba(140, 205, 255, 0.08), transparent 60%),
    linear-gradient(180deg, var(--bgA), var(--bgA));
}

/* ---------- 2) 雾气层：没有“球”，只有低对比色雾缓慢漂移 ---------- */
.mist {
  position: absolute;
  inset: -35%;
  background:
    radial-gradient(900px 650px at 10% 70%, var(--mist1), transparent 72%),
    radial-gradient(850px 650px at 90% 45%, var(--mist2), transparent 74%),
    radial-gradient(800px 600px at 45% 30%, var(--mist3), transparent 74%);
  filter: blur(70px);
  opacity: 0.95;
  transform: translateZ(0);
  animation: mistDrift 22s ease-in-out infinite alternate;
}

.dark .mist {
  filter: blur(78px);
  opacity: 0.92;
}

@keyframes mistDrift {
  0%   { transform: translate(-1.5%, 1%) scale(1); }
  50%  { transform: translate(1.2%, -1.6%) scale(1.03); }
  100% { transform: translate(2%, 1.8%) scale(1.02); }
}

/* ---------- 3) 微光扫过：丝绸反光（更新：两束不同色温） ---------- */
.sheen {
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(900px 600px at 20% 20%, var(--sheenA), var(--sheen2) 60%),
    radial-gradient(800px 520px at 80% 30%, var(--sheenB), var(--sheen2) 62%);
  filter: blur(30px);
  opacity: 0.35;
  mix-blend-mode: soft-light;
  animation: sheenMove 16s ease-in-out infinite alternate;
}

.dark .sheen {
  opacity: 0.30;
}

@keyframes sheenMove {
  0%   { transform: translate(-2%, -1%) rotate(-6deg); }
  100% { transform: translate(2%, 1.5%) rotate(6deg); }
}

/* ---------- 4) 细网格：更细更淡，不抢内容 ---------- */
.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid) 1px, transparent 1px);
  background-size: 84px 84px;
  opacity: 0.28;
  mask-image: radial-gradient(70% 60% at 50% 30%, #000 55%, transparent 100%);
}

/* ---------- 5) 暗角：让画面更“收” ---------- */
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(78% 70% at 50% 28%, transparent 38%, var(--vignette) 100%);
}

.dark .vignette {
  background: radial-gradient(80% 72% at 50% 26%, transparent 42%, var(--vignette) 100%);
}

/* ---------- 6) 噪点：雾面质感关键，浅色也不“白板” ---------- */
.noise {
  position: absolute;
  inset: 0;
  opacity: var(--noiseOpacity);
  background-image:
    radial-gradient(circle at 18% 22%, rgba(255,255,255,0.55) 0.5px, transparent 1px),
    radial-gradient(circle at 72% 64%, rgba(0,0,0,0.45) 0.5px, transparent 1px),
    radial-gradient(circle at 40% 80%, rgba(0,0,0,0.35) 0.5px, transparent 1px);
  background-size: 160px 160px, 180px 180px, 210px 210px;
  mix-blend-mode: overlay;
}

/* ---------- 减少动效 ---------- */
@media (prefers-reduced-motion: reduce) {
  .mist,
  .sheen {
    animation: none;
  }
  .layer {
    transition-duration: 0ms !important;
  }
}
</style>
