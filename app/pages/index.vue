<template>
  <div>
    <div class="max-w-[1100px] mx-auto grid grid-cols-2 items-center justify-items-center gap-60 relative min-h-screen text-black dark:text-white">
      <div class="">
        QWQ
      </div>

      <div class="size-[300px] rounded-full overflow-hidden border border-zinc-300 shadow-[2px_2px_12px_rgba(0,0,0,0.10)] shadow-stone-700/10 dark:shadow-white/30">
        <img src="/97312fe5-5a1d-41b8-a77b-7cc61d792c36.png" alt="avatar" loading="lazy" draggable="false">
      </div>

      <div class="absolute bottom-0 flex flex-col items-center gap-6">
        <div>
          向下滑动
        </div>
        <div class="animate-bounce">
          <img src="/icons/down.svg" class="size-6 dark:invert">
        </div>
      </div>
    </div>

    <div class="max-w-[1100px] mx-auto px-4 pb-12 pt-36 space-y-8 text-black dark:text-white">
      <ul>
        <li v-for="value in 90">
          内容
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>