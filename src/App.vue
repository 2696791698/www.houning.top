<template>
  <div class="h-screen bg-cover bg-[url('@/assets/background.jpg')]">
    <Header/>

    <div class="flex flex-col items-center lg:items-stretch lg:flex-row px-20 py-14 lg:space-x-12">
      <main class="flex-1 justify-center">
        <RouterView/>
      </main>
      <aside class="sticky">
        <Sidebar/>
      </aside>
    </div>

    <Footer/>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import Sidebar from "@/components/Sidebar.vue"

</script>
import { RouterView } from 'vue-router'
<style scoped>

</style>