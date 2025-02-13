<script setup>
import { Heart, Users, Map, Image as ImageIcon } from 'lucide-vue-next';

const props = defineProps({
  scrollToSection: {
    type: Function,
    required: true
  }
});

const navItems = [
  { id: 'together', icon: Heart,},
  { id: 'timeline', icon: Users,  },
  { id: 'places', icon: Map, },
  { id: 'gallery', icon: ImageIcon,  }
];
</script>

<template>
  <nav class="fixed left-0 top-1/2 -translate-y-1/2 bg-pink-500/90 backdrop-blur-sm text-white p-3 rounded-r-xl z-50 shadow-lg">
    <ul class="flex flex-col gap-6">
      <li v-for="item in navItems" :key="item.id">
        <button
          @click="scrollToSection(item.id)"
          class="group relative flex items-center hover:text-yellow-300 transition-all duration-300"
        >
          <component :is="item.icon" class="w-6 h-6" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>

button {
  transform: scale(1);
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.1);
}
</style>