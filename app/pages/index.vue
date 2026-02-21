<script setup>
const { data } = await useFetch('/api/posts')
</script>

<template>
  <div class="max-w-[1100px] mx-auto px-4 py-16 space-y-8 text-black dark:text-white">
    <h1>文章列表</h1>
    <ul>
      <li v-for="post in data" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>
