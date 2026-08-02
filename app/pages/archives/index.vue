<template>
  <main class="archive-page max-w-[1100px] mx-auto px-4 pb-12 pt-36 text-black dark:text-white">
    <div v-if="postsByYear.length" class="archive-timeline">
      <section v-for="group in postsByYear" :key="group.year" class="timeline-year">
        <h2 class="timeline-year-label">
          {{ group.year }}
        </h2>

        <ol class="timeline-list">
          <li v-for="post in group.posts" :key="post.path" class="timeline-item">
            <span class="timeline-node" aria-hidden="true"/>

            <article class="timeline-entry">
              <time class="timeline-date" :datetime="post.date">
                {{ post.date }}
              </time>

              <h3 class="timeline-title">
                <NuxtLink :to="post.path" class="timeline-link">
                  <span class="">
                    {{ post.title }}
                  </span>
                </NuxtLink>
              </h3>

              <p v-if="post.category" class="timeline-category">
                {{ post.category }}
              </p>
            </article>
          </li>
        </ol>
      </section>
    </div>

    <p v-else class="py-20 text-center text-black/50 dark:text-white/50">
      暂无文章
    </p>
  </main>
</template>

<script setup lang="ts">
// 解构重命名: 等价于 const posts = result.data;
const {data: posts} = await useAsyncData('archive-posts', () => {
  return queryCollection('content')
      .where('path', 'LIKE', '/posts/%')
      .where('date', 'IS NOT NULL')
      .select('path', 'title', 'description', 'date', 'category')
      .order('date', 'DESC')
      .all()
})

// [number] 索引访问类型: 取类型里的某个字段类型(这里是取所有数字 = 取数组里每个元素)
type ArchivePost = NonNullable<typeof posts.value>[number]

const postsByYear = computed(() => {
  // <> 泛型: 给一个东西指定“里面装什么类型”
  const groups = new Map<string, ArchivePost[]>()

  for (const post of posts.value ?? []) {
    if (!post.date) {
      continue
    }

    const year = post.date.slice(0, 4)
    const currentGroup = groups.get(year)

    if (currentGroup) {
      currentGroup.push(post)
    } else {
      groups.set(year, [post])
    }
  }

  return Array.from(groups, ([year, posts]) => ({
    year,
    posts
  }))
})
</script>

<style scoped>
.archive-page {
  min-height: calc(100vh - 15rem);
}

.archive-timeline {
  width: min(100%, 820px);
}

.timeline-year + .timeline-year {
  margin-top: 4.5rem;
}

.timeline-year-label {
  display: inline-flex;
  align-items: center;
  height: 2.25rem;
  padding: 0 0.875rem;
  border: 1px solid rgba(31, 44, 57, 0.16);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 8px 24px rgba(28, 40, 52, 0.08);
  color: rgba(21, 31, 40, 0.82);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.timeline-list {
  position: relative;
  margin: 1.5rem 0 0;
  padding: 0 0 0 2.75rem;
  list-style: none;
}

.timeline-list::before {
  position: absolute;
  top: 0.45rem;
  bottom: 0.25rem;
  left: 0.75rem;
  width: 1px;
  background: rgba(31, 44, 57, 0.2);
  content: "";
}

.timeline-item {
  position: relative;
  padding-bottom: 2.75rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-node {
  position: absolute;
  top: 0.25rem;
  left: -2.4375rem;
  width: 0.875rem;
  height: 0.875rem;
  border: 3px solid rgba(31, 44, 57, 0.28);
  border-radius: 50%;
  background: rgba(242, 244, 245, 0.88);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.16);
}

.timeline-date {
  display: block;
  margin-bottom: 0.4rem;
  color: rgba(31, 44, 57, 0.58);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
}

.timeline-title {
  margin: 0;
  color: rgba(18, 27, 36, 0.92);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
}

.timeline-category {
  margin: 0.45rem 0 0;
  color: rgba(31, 44, 57, 0.55);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

:global(.dark) .timeline-year-label {
  border-color: rgba(220, 234, 245, 0.16);
  background: rgba(24, 39, 55, 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  color: rgba(244, 248, 252, 0.9);
}

:global(.dark) .timeline-list::before {
  background: rgba(220, 234, 245, 0.2);
}

:global(.dark) .timeline-node {
  border-color: rgba(220, 234, 245, 0.42);
  background: rgba(29, 47, 65, 0.88);
  box-shadow: 0 0 0 4px rgba(19, 32, 48, 0.3);
}

:global(.dark) .timeline-date,
:global(.dark) .timeline-category {
  color: rgba(226, 236, 245, 0.58);
}

:global(.dark) .timeline-title {
  color: rgba(248, 251, 255, 0.94);
}

@media (max-width: 640px) {
  .archive-page {
    padding-top: 7rem;
  }

  .timeline-year + .timeline-year {
    margin-top: 3.5rem;
  }

  .timeline-title {
    font-size: 1.125rem;
  }
}

.timeline-link {
  color: inherit;
  font-weight: inherit;
  text-decoration: none;
  text-decoration-color: transparent;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.2em;
  transition: color 180ms ease, text-decoration-color 180ms ease;
}

.timeline-link:hover {
  color: rgba(143, 95, 67, 0.96);
  text-decoration: underline;
  text-decoration-color: currentColor;
}

.timeline-link:focus-visible {
  border-radius: 2px;
  outline: 2px solid rgba(143, 95, 67, 0.72);
  outline-offset: 4px;
}

.timeline-node {
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}

.timeline-item:hover .timeline-node,
.timeline-item:focus-within .timeline-node {
  transform: scale(1.18);
  border-color: rgba(143, 95, 67, 0.72);
  background-color: rgba(255, 246, 238, 0.96);
}

:global(.dark) .timeline-link:hover {
  color: rgba(225, 190, 157, 0.96);
}

:global(.dark) .timeline-link:focus-visible {
  outline-color: rgba(225, 190, 157, 0.82);
}

:global(.dark) .timeline-item:hover .timeline-node,
:global(.dark) .timeline-item:focus-within .timeline-node {
  border-color: rgba(225, 190, 157, 0.82);
  background-color: rgba(72, 53, 44, 0.92);
}

@media (prefers-reduced-motion: reduce) {
  .timeline-link,
  .timeline-node {
    transition: none;
  }
}
</style>