<script setup lang="ts">
defineProps<{
  name: string
  targetLink: string
  avatarLink: string
}>()

const imageLoadFailed = ref(false)

// 等价于:
// interface Props {
//   name: string
//   targetLink: string
//   avatarLink: string
// }
//
// defineProps<Props>()
</script>

<template>
  <a class="friend-card"
     :href="targetLink"
     target="_blank"
     rel="noopener noreferrer"
  >
    <div class="friend-card-avatar">
      <img v-if="!imageLoadFailed" :src="avatarLink" @error="imageLoadFailed = true">
      <span v-else class="friend-card-avatar-fallback" role="img">
        <UIcon name="lucide:image-off" class="friend-card-avatar-icon" />
      </span>
    </div>

    <span class="friend-card-name">
      {{ name }}
    </span>

    <span class="place-content-end">
      <span class="friend-card-arrow">
        ↗
      </span>
    </span>
  </a>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.friend-card {
  @apply backdrop-blur-sm border border-white/20;
  @apply shadow-[2px_2px_10px_rgba(0,0,0,0.10)] shadow-gray-500/20;
  @apply transition-all duration-300 ease-out rounded-4xl;
  @apply p-4 gap-2 w-full min-h-32 overflow-hidden flex justify-between;

  @variant dark {
    @apply bg-white/8 border-white/16;
    @apply shadow-[2px_2px_14px_rgba(0,0,0,0.2)];
  }
}

.friend-card:hover {
  @apply bg-white/50 border-white/72;
  @apply shadow-[4px_8px_24px_rgba(0,0,0,0.2)] -translate-y-3;

  @variant dark {
    @apply bg-white/13 border-white/24;
  }
}

.friend-card-name {
  @apply place-content-center wrap-anywhere text-2xl font-bold;
}

.friend-card-arrow {
  @apply grid place-content-center size-10 shrink-0;
  @apply border-2 border-gray-500/60 rounded-4xl;

  @variant dark {
    @apply border-gray-300/40;
  }
}

.friend-card-avatar {
  @apply grid place-content-center size-42 shrink-0;
  @apply rounded-full bg-gray-300/50;
  @apply overflow-hidden;
}

.friend-card-avatar img {
  @apply size-42 object-cover;
}

.friend-card-avatar-fallback {
  @apply inline-flex max-w-full items-center justify-center gap-2 px-3 text-center text-sm;
}

.friend-card-avatar-icon {
  @apply size-6 shrink-0 text-gray-500/70;

  @variant dark {
    @apply text-gray-300/70;
  }
}
</style>
