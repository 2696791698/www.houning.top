<template>
  <main class="max-w-[1100px] mx-auto px-4 pb-16 pt-36 text-black dark:text-white">
    <article v-if="post">
      <ContentRenderer :value="post" />
    </article>
    <p v-else>文章未找到</p>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`post-${route.path}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章未找到' })
}
</script>