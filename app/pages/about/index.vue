<template>
  <div class="max-w-[1100px] mx-auto px-4 py-16 space-y-8 text-black dark:text-white">
    <article>
      <ContentRenderer v-if="post" :value="post" />
      <div v-else>页面未找到</div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(() => {
  return queryCollection('content').path(`/pages${route.path}`).first()
})
</script>