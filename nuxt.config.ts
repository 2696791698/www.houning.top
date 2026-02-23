import tailwindcss from '@tailwindcss/vite'
import type { NuxtConfig } from 'nuxt/schema'

// 规避 Nuxt 内置的 Vite 类型与 @tailwindcss/vite 插件类型之间的临时不匹配问题
const tailwindVitePlugins =
  tailwindcss() as unknown as NonNullable<NuxtConfig['vite']>['plugins']

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@nuxt/content'
  ],
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  vite: {
    plugins: tailwindVitePlugins
  }
})
