<template>
  <div class="min-h-screen flex justify-center items-center bg-pink-100">
    <router-link to="/love" @click="startLoveJourney" custom v-slot="{ navigate }">
      <button 
        @click="navigate"
        class="px-6 py-3 bg-red-500 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-red-400 transition"
      >
        Start Love Counter ❤️
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const startLoveJourney = () => {
  // Set a flag in localStorage to indicate we're coming from the home page
  localStorage.setItem('fromHome', 'true');
};
</script>