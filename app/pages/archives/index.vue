<template>
  <div class="max-w-[1100px] mx-auto px-4 py-16 space-y-8 text-black dark:text-white">
    <article>
      <ContentRenderer v-if="post" :value="post" />
      <div v-else>文章未找到</div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
// 查询特定路径的文章
const { data: post } = await useAsyncData(() => {
  return queryCollection('content').path(route.path).first()
})
</script>