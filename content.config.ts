import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        category: z.string().optional()
      })
    })
  }
})