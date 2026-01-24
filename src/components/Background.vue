<template>
  <div class="background-container">
    <div ref="canvasWrapper" class="canvas-wrapper">
      <canvas ref="canvasEl"></canvas>
    </div>
    <div class="noise-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const canvasEl = ref<HTMLCanvasElement | null>(null);
const isDark = ref(false);

// 配置常量
const RES_SCALE = 0.2; // 性能优化：20% 分辨率

// 状态变量
let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let animationId: number;
let isPaused = false;
let currentMixMode = 'screen';
const mouse = { x: -1000, y: -1000, active: false };

// 调色板定义
type Color = { h: number; s: number; l: number };
// Pale Blue (淡蓝), Pale Sunset (淡夕阳/杏色), Pale Aurora (淡极光/薄荷), Lavender Mist (薰衣草雾)
const palettes: Color[][] = [
  [ { h: 210, s: 60, l: 70 }, { h: 240, s: 50, l: 65 }, { h: 190, s: 60, l: 70 }, { h: 280, s: 40, l: 70 } ],
  [ { h: 350, s: 60, l: 70 }, { h: 30, s: 60, l: 75 }, { h: 280, s: 40, l: 65 }, { h: 40, s: 50, l: 70 } ],
  [ { h: 160, s: 50, l: 65 }, { h: 130, s: 40, l: 70 }, { h: 200, s: 60, l: 70 }, { h: 220, s: 50, l: 70 } ],
  [ { h: 260, s: 40, l: 70 }, { h: 300, s: 40, l: 70 }, { h: 220, s: 50, l: 75 }, { h: 280, s: 30, l: 70 } ]
];

let currentPaletteIndex = 0;
let blobs: Blob[] = [];
let colorCycleInterval: number;

// 辅助函数：线性插值
function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}

// Blob 类
class Blob {
  color: { h: number; s: number; l: number };
  targetColor: { h: number; s: number; l: number };
  x: number = 0;
  y: number = 0;
  radius: number = 0;
  currentRadius: number = 0;
  vx: number = 0;
  vy: number = 0;
  angleX: number = 0;
  angleY: number = 0;
  freqX: number = 0;
  freqY: number = 0;
  scalePhase: number = 0;

  constructor(colorData: { h: number; s: number; l: number }) {
    this.color = { ...colorData };
    this.targetColor = { ...colorData };
    this.init();
  }

  init() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    this.radius = minDim * (0.4 + Math.random() * 0.4);
    this.currentRadius = this.radius;

    const speedFactor = 0.8;
    this.vx = (Math.random() - 0.5) * 2 * speedFactor;
    this.vy = (Math.random() - 0.5) * 2 * speedFactor;

    this.angleX = Math.random() * Math.PI * 2;
    this.angleY = Math.random() * Math.PI * 2;
    this.freqX = 0.0005 + Math.random() * 0.001;
    this.freqY = 0.0005 + Math.random() * 0.001;
    this.scalePhase = Math.random() * Math.PI * 2;
  }

  setTargetColor(newColor: { h: number; s: number; l: number }) {
    this.targetColor = { ...newColor };
  }

  update() {
    // 优化后的向中心聚集逻辑：
    // 引入“自由活动区”，只有超出核心区域才施加极其微弱的向心力
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // 自由区半径：屏幕短边的 35%
    const freeZoneRadius = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    
    if (dist > freeZoneRadius) {
       // 超出区域，施加极其微弱的力
       // 或者是反向力，这里我们用更小的系数
       // 距离越远力稍微大一点点，或者恒定微弱力
       const pullFactor = 0.00001; 
       this.vx -= dx * pullFactor;
       this.vy -= dy * pullFactor;
    }

    // 颜色变化速度
    const lerpSpeed = 0.005;
    this.color.h = lerp(this.color.h, this.targetColor.h, lerpSpeed);
    this.color.s = lerp(this.color.s, this.targetColor.s, lerpSpeed);
    this.color.l = lerp(this.color.l, this.targetColor.l, lerpSpeed);

    this.angleX += this.freqX;
    this.angleY += this.freqY;
    this.x += Math.cos(this.angleX) * 1.5 + this.vx;
    this.y += Math.sin(this.angleY) * 1.5 + this.vy;

    if (mouse.active) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const interactRadius = window.innerWidth * 0.4;
      if (dist < interactRadius) {
        const force = (interactRadius - dist) / interactRadius;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
      }
    }

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const padding = -this.radius * 0.5;

    if (this.x < padding) this.vx += 0.02;
    if (this.x > screenW - padding) this.vx -= 0.02;
    if (this.y < padding) this.vy += 0.02;
    if (this.y > screenH - padding) this.vy -= 0.02;

    const maxSpeed = 1.5;
    this.vx = Math.max(Math.min(this.vx, maxSpeed), -maxSpeed);
    this.vy = Math.max(Math.min(this.vy, maxSpeed), -maxSpeed);

    this.scalePhase += 0.003;
    this.currentRadius = this.radius * (1 + Math.sin(this.scalePhase) * 0.1);
  }

  draw() {
    if (!ctx) return;
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.currentRadius
    );

    const { h, s, l } = this.color;

    // 绘制时的亮度调整
    let drawL = l;
    if (!isDark.value) {
      drawL = Math.max(l - 5, 50);
    }

    gradient.addColorStop(0, `hsla(${h}, ${s}%, ${drawL}%, 1)`);
    gradient.addColorStop(1, `hsla(${h}, ${s}%, ${drawL}%, 0)`);

    ctx.fillStyle = gradient;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(1 + Math.sin(this.angleX) * 0.1, 1 + Math.cos(this.angleY) * 0.1);
    ctx.translate(-this.x, -this.y);
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createBlobs() {
  blobs = [];
  const colors = palettes[currentPaletteIndex];
  if (!colors) return;
  for (let i = 0; i < 5; i++) {
    const color = colors[i % colors.length];
    if (color) {
      blobs.push(new Blob(color));
    }
  }
}

function resize() {
  if (!canvasEl.value || !ctx) return;
  width = Math.ceil(window.innerWidth * RES_SCALE);
  height = Math.ceil(window.innerHeight * RES_SCALE);
  canvasEl.value.width = width;
  canvasEl.value.height = height;
  ctx.scale(RES_SCALE, RES_SCALE);
}

function animate() {
  if (!ctx || isPaused) {
    animationId = requestAnimationFrame(animate);
    return;
  }
  
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.globalCompositeOperation = (currentMixMode as GlobalCompositeOperation) || 'hard-light';

  blobs.forEach(blob => {
    blob.update();
    blob.draw();
  });
  animationId = requestAnimationFrame(animate);
}

function startAutoColorCycle() {
  colorCycleInterval = window.setInterval(() => {
    if (isPaused) return;
    currentPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
    const nextPalette = palettes[currentPaletteIndex];
    if (!nextPalette) return;
    blobs.forEach((blob, index) => {
      const nextColor = nextPalette[index % nextPalette.length];
      if (nextColor) {
        blob.setTargetColor(nextColor);
      }
    });
  }, 8000);
}

// 事件监听与交互
function handleResize() {
  resize();
  blobs.forEach(b => b.init());
}

function handleMouseMove(e: MouseEvent) {
  mouse.active = true;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function handleMouseLeave() {
  mouse.active = false;
}

function handleTouchMove(e: TouchEvent) {
  mouse.active = true;
  if (e.touches && e.touches.length > 0) {
    const touch = e.touches[0];
    if (touch) {
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
    }
  }
}

// 主题检测
let observer: MutationObserver | null = null;

function updateTheme() {
    // 假设项目使用 'dark' class 在 html 或 body 上
    const isDarkClass = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    console.log('Background: updateTheme called. Detected dark class:', isDarkClass);
    isDark.value = isDarkClass;
    
    // 更新混合模式
    // 深色模式使用 screen, 亮色模式使用 multiply (参考原 demo)
    currentMixMode = isDark.value ? 'screen' : 'multiply';
}

onMounted(() => {
  if (!canvasEl.value) return;
  
  ctx = canvasEl.value.getContext('2d', { alpha: true });
  if (!ctx) return;
  
  // 初始化
  updateTheme();
  resize();
  createBlobs();
  startAutoColorCycle();
  animate(); // 启动动画循环

  // 监听器
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  // 使用 passive: false 如果需要阻止默认行为，但这里为了不影响页面滚动，先不加 preventDefault
  window.addEventListener('touchmove', handleTouchMove);

  // 监听 DOM 变化以检测主题切换
  observer = new MutationObserver(updateTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  clearInterval(colorCycleInterval);
  
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
  window.removeEventListener('touchmove', handleTouchMove);
  
  if (observer) observer.disconnect();
});

</script>

<style scoped>
/* 背景颜色的样式已移动到 src/index.css 以修复深色模式优先级问题 */

.canvas-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  /* 关键修改：降低饱和度 (0.85)，增加模糊 (70px)，轻微提升亮度 */
  filter: blur(70px) saturate(0.85) brightness(1.1);
  transform: translate3d(0,0,0) scale(1.1); 
  opacity: var(--canvas-opacity);
  transition: opacity 1s ease;
  pointer-events: auto; /*为了捕获鼠标移动，可能需要 auto，但如果全屏覆盖可能会阻挡其他点击 */
  /* 如果需要Blob交互，但又不阻挡页面点击，可能需要 JS 监听 window 鼠标事件而不是 canvas 元素事件 (代码中已改为 window 监听) */
  pointer-events: none; 
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
  background-size: 150px 150px; 
  opacity: var(--noise-opacity);
  filter: var(--noise-filter);
  transition: opacity 0.5s ease;
}
</style>
