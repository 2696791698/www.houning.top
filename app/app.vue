<script setup>
const { data } = await useFetch('/api/posts')
</script>

<template>
  <div>
    <h1>文章列表</h1>
    <ul>
      <li v-for="post in data" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>
