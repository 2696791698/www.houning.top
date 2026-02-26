<template>
  <ClientOnly>
    <LazyUContentSearch
      v-model:search-term="searchTerm"
      :files="files"
      :navigation="navigation"
      :shortcut="false"
      :fuse="{ resultLimit: 42 }"
      :color-mode="false"
    />
  </ClientOnly>
  <!-- 占位 -->
  <!-- <div class="h-[80px]" /> -->
  <!-- 脱离文本流+贴顶 -->
  <div class="fixed top-0 inset-x-0 z-10">
    <!-- 背景模糊 -->
    <div
      class="absolute inset-0 pointer-events-none"
      :style="{
        backgroundColor: `rgba(255,255,255,${0.08 * scrollYProgress})`,
        backdropFilter: `blur(${20 * scrollYProgress}px)`,
        WebkitBackdropFilter: `blur(${20 * scrollYProgress}px)`
      }"
    />
    <!-- 内容 -->
    <div class="mx-auto h-[80px] overflow-hidden grid grid-cols-[1fr_2fr_1fr]">
      <div class="flex items-center justify-center z-10">
        
      </div>

      <div class="flex items-center justify-center">
        <!-- 外壳胶囊 -->
        <div
          class="flex items-center justify-center relative rounded-full dark:bg-white/10 backdrop-blur-sm shadow-[2px_2px_10px_rgba(0,0,0,0.10)] shadow-gray-500/20 dark:shadow-white/10 border border-white/20 h-[50px]"
          ref="navRef"
          @mouseleave="moveToActive">

          <!-- 滑动胶囊 -->
          <div 
            class="absolute left-0 inset-y-[6px] rounded-full bg-white/20 border border-white/10 pointer-events-none transition-all duration-300 ease-out z-20 shadow-[2px_2px_10px_rgba(0,0,0,0.10)] shadow-gray-500/20 dark:shadow-white/10"
            :style="capsuleStyle" />

          <ul class="relative z-10 flex gap-1">
            <li v-for="item in menus" :key="item.key">
              <NuxtLink
                :to="item.to"
                :data-key="item.key"
                :ref="(el) => setItemRef(el, item.key)"
                class="block px-8 py-3 rounded-full font-medium text-center transition-colors duration-200"
                :class="item.key === activeKey ? 'text-white' : 'text-white/70 hover:text-white'"
                @mouseenter.prevent="moveToKey(item.key)"
                @mousedown="isPressing = true"
                @mouseup="isPressing = false"
                @mouseleave="isPressing = false"
                @touchstart="isPressing = true"
                @touchend="isPressing = false"
              >
                <span class="text-black dark:text-white select-none">
                  {{ item.label }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex items-center px-[15px] z-10 space-x-[15px]">
        <!-- <a 
          class="flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 size-[50px] active:scale-95 hover:shadow-[2px_2px_10px_rgba(0,0,0,0.10)] hover:shadow-white/10 transition-all duration-200 ease-in-out hover:bg-white/20 hover:border hover:border-white/10" 
          href="https://space.bilibili.com/3537112158701795" 
          target="_blank">
          <div>
            <svg height="24px" width="24px" viewBox="0 0 1024 1024">
              <path id="bilibiliIcon" :d="bilibiliPath" :fill="theme === 'light' ? '#000' : '#fff'" />
            </svg>
          </div>
        </a>

        <a 
          class="flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 size-[50px] active:scale-95 hover:shadow-[2px_2px_10px_rgba(0,0,0,0.10)] hover:shadow-white/10 transition-all duration-200 ease-in-out hover:bg-white/20 hover:border hover:border-white/10" 
          href="https://github.com/2696791698" 
          target="_blank">
          <div>
            <svg height="24px" width="24px" viewBox="0 0 1024 1024">
              <path id="githubIcon" :d="githubPath" :fill="theme === 'light' ? '#000' : '#fff'" />
            </svg>
          </div>
        </a> -->

        <div 
          class="flex items-center justify-center rounded-full bg-white/10 hover:bg-stone-200/30 dark:hover:bg-white/20 backdrop-blur-sm border border-white/20 size-[50px] active:scale-95 shadow-[2px_2px_10px_rgba(0,0,0,0.10)] hover:shadow-stone-700/20 dark:hover:shadow-white/10 transition-all duration-200 ease-in-out hover:border hover:border-white/10 cursor-pointer"
          @click="toggleThemeAnimated">
          <svg height="24px" width="24px" viewBox="0 0 1024 1024">
            <path id="darkModeIcon" :d="moonPath" :fill="theme === 'light' ? '#000' : '#fff'" />
          </svg>
        </div>

        <div 
          class="flex items-center justify-center rounded-full bg-white/10 hover:bg-stone-200/30 dark:hover:bg-white/20 backdrop-blur-sm border border-white/20 size-[50px] active:scale-95 shadow-[2px_2px_10px_rgba(0,0,0,0.10)] hover:shadow-stone-700/20 dark:hover:shadow-white/10 transition-all duration-200 ease-in-out hover:border hover:border-white/10 cursor-pointer"
          @click="open = true">
          <svg height="24px" width="24px" viewBox="0 0 1024 1024">
            <path :d="searchPath" :fill="theme === 'light' ? '#000' : '#fff'" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
gsap.registerPlugin(MorphSVGPlugin)

const { toggleTheme, theme } = useThemeMode()
const moonPath = 'M439.04383639 224.33271976a289.43717504 289.43717504 0 0 0-89.06329676 39.44690807c-27.5075319 18.12412161-51.158867 39.64960558-70.96389486 64.57645191-19.79019562 24.92684633-35.31880082 53.25011237-46.62042137 84.97474006C221.10449032 445.05050411 215.45368042 478.01109252 215.45368042 512c0 40.16870887 7.81621301 78.48347702 23.45358166 115.04318192 15.64725682 36.67341315 36.77228986 68.19039996 63.2910532 94.76354538 26.53359488 26.56820206 58.11485196 47.57952611 94.69927585 63.23667111 36.59431134 15.65714501 75.00301286 23.48324474 115.16183354 23.48324475 33.97407594 0 66.85061917-5.56182137 98.62468557-16.89310498 31.76417894-11.32633953 60.10227581-26.77584294 85.01429133-46.65502781 24.87740834-19.77536407 46.43255539-43.46625042 64.57150781-70.96389488a290.15403174 290.15403174 0 0 0 39.43701989-88.98913905c-8.3056532 0.72180079-17.71378249 1.13213991-28.0958481 1.1321392-45.21637032 0-88.35138342-8.85936294-129.45942212-26.46932463-41.1327577-17.71872658-76.62459295-41.50848964-106.44089858-71.27535655C505.84007277 458.54719011 482.10963587 423.01086095 464.42057238 381.91765379 446.7562286 340.81455917 437.94135957 297.65977044 437.94135957 252.4483442c0-10.40184195 0.39550758-19.77536407 1.15685891-28.01674772l-0.049438-0.09887672zM512.02976157 141.21192041c8.32542811 0 16.51242896 0.31146168 24.6054972 0.92944167-16.4036648 35.32374419-24.60549719 72.09603405-24.60549719 110.30698212 0 35.12104668 6.84227598 68.69961578 20.58121076 100.83458258 13.70927096 32.03114601 32.15474243 59.63261126 55.35124448 82.80933769 23.16683898 23.17178306 50.76830423 41.60736635 82.82416923 55.30674985 32.02125855 13.69938351 65.654209 20.60098567 100.78514387 20.60098568 38.23072298 0 75.03267594-8.24138293 110.35147675-24.62032874 0.59326099 8.14250622 0.86517214 16.28006837 0.86517213 24.62032874 0 33.57856837-4.43956893 66.43533597-13.29893256 98.46648269-8.90880166 32.03114601-21.28817928 61.69419283-37.24195443 88.78149743-15.92411206 27.19112615-35.31880082 52.11797247-58.09013296 74.87941716-22.77627549 22.76144395-47.74267309 42.12152555-74.87447306 58.09013223-27.15157487 15.96366261-56.75529553 28.32326532-88.78644152 37.28644905A368.16784419 368.16784419 0 0 1 512.00009921 882.78807959a368.20739474 368.20739474 0 0 1-98.48625832-13.28904439c-32.03609009-8.95824037-61.6249792-21.31784236-88.79138561-37.28150569-27.12685589-15.96860669-52.08336529-35.32868827-74.89919206-58.09013223-22.7515565-22.76144395-42.13635709-47.68829101-58.05058169-74.87941715-15.96366261-27.0922487-28.34304097-56.75529553-37.2518426-88.78149744A367.9354836 367.9354836 0 0 1 141.21201889 512c0-33.57856837 4.4494571-66.43533597 13.30882004-98.46648269 8.90880166-32.03114601 21.28817928-61.69419283 37.25184259-88.78149744 15.91916798-27.19112615 35.29902519-52.11797247 58.0505817-74.87941715 22.81582676-22.86526476 47.77233617-42.22534634 74.89919206-58.09013223C351.89380578 175.81880789 381.4826949 163.36032846 413.51878498 154.50096479A368.20739474 368.20739474 0 0 1 512.00009921 141.21192041h0.02966236z'
const sunPath = 'M512 224c159.058 0 288 128.942 288 288S671.058 800 512 800 224 671.058 224 512s128.942-288 288-288z m0 64c-123.712 0-224 100.288-224 224s100.288 224 224 224 224-100.288 224-224-100.288-224-224-224z m0 576c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32zM263.098 760.902c12.497 12.496 12.497 32.758 0 45.254l-45.254 45.255c-12.497 12.497-32.758 12.497-45.255 0s-12.497-32.758 0-45.255l45.255-45.254c12.496-12.497 32.758-12.497 45.254 0z m543.058 0l45.255 45.254c12.497 12.497 12.497 32.758 0 45.255s-32.758 12.497-45.255 0l-45.254-45.255c-12.497-12.496-12.497-32.758 0-45.254 12.496-12.497 32.758-12.497 45.254 0zM128 480c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H64c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h64z m832 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32h-64c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h64zM217.844 172.589l45.254 45.255c12.497 12.496 12.497 32.758 0 45.254-12.496 12.497-32.758 12.497-45.254 0l-45.255-45.254c-12.497-12.497-12.497-32.758 0-45.255s32.758-12.497 45.255 0z m633.567 0c12.497 12.497 12.497 32.758 0 45.255l-45.255 45.254c-12.496 12.497-32.758 12.497-45.254 0-12.497-12.496-12.497-32.758 0-45.254l45.254-45.255c12.497-12.497 32.758-12.497 45.255 0zM512 32c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32-17.673 0-32-14.327-32-32V64c0-17.673 14.327-32 32-32z'
const githubPath = 'M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z'
const bilibiliPath = 'M306.005333 117.632L444.330667 256h135.296l138.368-138.325333a42.666667 42.666667 0 1 1 60.373333 60.373333l-78.037333 77.952L789.333333 256A149.333333 149.333333 0 0 1 938.666667 405.333333v341.333334a149.333333 149.333333 0 0 1-149.333334 149.333333h-554.666666A149.333333 149.333333 0 0 1 85.333333 746.666667v-341.333334A149.333333 149.333333 0 0 1 234.666667 256h88.96L245.632 177.962667a42.666667 42.666667 0 0 1 60.373333-60.373334zM789.333333 341.333333h-554.666666a64 64 0 0 0-63.701334 57.856L170.666667 405.333333v341.333334a64 64 0 0 0 57.856 63.701333L234.666667 810.666667h554.666666a64 64 0 0 0 63.701334-57.813334L853.333333 746.666667v-341.333334A64 64 0 0 0 789.333333 341.333333zM341.333333 469.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333a42.666667 42.666667 0 1 1-85.333333 0v-85.333333a42.666667 42.666667 0 0 1 42.666666-42.666667z m341.333334 0a42.666667 42.666667 0 0 1 42.666666 42.666667v85.333333a42.666667 42.666667 0 1 1-85.333333 0v-85.333333a42.666667 42.666667 0 0 1 42.666667-42.666667z'
const searchPath = 'M446.112323 177.545051c137.567677 0.219798 252.612525 104.59798 266.162424 241.493333 13.562828 136.895354-78.778182 261.818182-213.617777 289.008485-134.852525 27.203232-268.386263-52.156768-308.945455-183.608889s25.018182-272.252121 151.738182-325.779394A267.235556 267.235556 0 0 1 446.112323 177.545051m0-62.060607c-182.794343 0-330.989899 148.195556-330.989899 330.989899s148.195556 330.989899 330.989899 330.989899 330.989899-148.195556 330.989899-330.989899-148.195556-330.989899-330.989899-330.989899z m431.321212 793.341415a30.849293 30.849293 0 0 1-21.94101-9.102223l-157.220202-157.220202c-11.752727-12.179394-11.584646-31.534545 0.37495-43.50707 11.972525-11.972525 31.327677-12.140606 43.494141-0.37495l157.220202 157.220202a31.036768 31.036768 0 0 1 6.723232 33.810101 31.004444 31.004444 0 0 1-28.651313 19.174142z m0 0'
const currentPath = ref("")

const menus = [
  { key: "home", label: "首页", to: "/"},
  { key: "articles", label: "归档", to: "/archives"},
  { key: "about", label: "关于", to: "/about"},
  { key: "friends", label: "友链", to: "/friends"}
]

const x = ref(0) // 胶囊的横向位移
const w = ref(0) // 胶囊宽度
const visible = ref(false) // 胶囊是否显示
const itemMap = new Map<string, HTMLElement>() // key到菜单项元素的映射, 方便通过key找到元素
const route = useRoute()
const scrollYProgress = ref(0)
const isPressing = ref(false)

const capsuleStyle = computed(() => {
  const scale = isPressing.value ? 0.9 : 1
  return {
    width: w.value ? `${w.value}px` : "0px",
    transform: `translateX(${x.value}px) scale(${scale})`,
    opacity: visible.value ? "1" : "0"
  }
})

const activeKey = computed(() => {
  return menus.find((item) => item.to === route.path)?.key ?? "/"
})

const searchTerm = ref('')
const { open } = useContentSearch()

const { data: navigation } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('content')
)

const { data: files } = useAsyncData('search', () =>
  queryCollectionSearchSections('content')
)

function setItemRef(el: any, key: string) {
  // NuxtLink 渲染后 el 可能是组件实例,, 需要通过 .$el 获取真正的 HTMLElement
  // HTMLElement: <div :ref="setItemRef" />
  // 组件实例: <NuxtLink :ref="setItemRef" />
  // .$el 把组件实例转换成 HTMLElement, 如果不是组件实例就用 el 本身
  const dom = el?.$el ?? el
  if (dom) {
    itemMap.set(key, dom as HTMLElement)
  }
}

function findEl(key: string) {
  return itemMap.get(key) ?? null
}

function moveToEl(el: HTMLElement | null) {
  if (!el) return
  x.value = el.offsetLeft + 6
  w.value = el.offsetWidth - 12
  visible.value = true
}

async function moveToKey(key: string) {
  await nextTick()
  moveToEl(findEl(key))
}

async function moveToActive() {
  await nextTick()
  moveToEl(findEl(activeKey.value))
}

async function toggleThemeAnimated() {
  const willBe = theme.value === "light" ? "dark" : "light"
  toggleTheme()

  // 等主题值变化 & DOM 更新（尤其你有 fill 颜色切换）
  await nextTick()

  const targetPath = willBe === "dark" ? sunPath : moonPath
  currentPath.value = targetPath

  gsap.to("#darkModeIcon", {
    duration: 0.3,
    morphSVG: targetPath,
    ease: "power3.inOut",
  })
}

watch(() => route.path, async () => {
  await nextTick()
  moveToActive()
})

onMounted(async () => {
  await nextTick()
  moveToActive()

  const onScroll = () => {
    scrollYProgress.value = Math.min(window.scrollY / 120, 1)
  }

  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
  onBeforeUnmount(() =>
    window.removeEventListener("scroll", onScroll)
  )

  currentPath.value = theme.value === "light" ? moonPath : sunPath
  gsap.set("#darkModeIcon", { morphSVG: currentPath.value })
})
</script>
