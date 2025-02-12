<template>
  <div class="min-h-screen flex justify-center items-center bg-pink-100">
    <!-- Mobile Warning -->
    <div v-if="isMobile" class="fixed inset-0 bg-pink-100 flex flex-col justify-center items-center p-6 z-50">
      <img 
        src="@/assets/img/typing.gif" 
        alt="Pusheen" 
        class="w-32 h-32 mb-4"
      />
      <div class="text-center">
        <h2 class="text-red-500 text-2xl font-bold mb-3">💝 I'm lazy 💝</h2>
        <p class="text-red-400 text-lg mb-2">For the best experience of our love story,</p>
        <p class="text-red-400 text-lg">please view this on a laptop or PC! 💌</p>
      </div>
    </div>

    <!-- Loading Screen -->
    <div v-if="isLoading" class="fixed inset-0 bg-pink-100 flex flex-col justify-center items-center z-50">
      <img 
        src="@/assets/img/pusheen-pusheen-cat.gif" 
        alt="Pusheen Loading" 
        class="w-40 h-40 mb-4"
      />
      <div class="text-red-500 text-xl font-semibold animate-pulse">
        {{ loadingMessage }}
      </div>
    </div>

    <!-- Main Button -->
    <button 
      @click="handleClick"
      :disabled="isLoading || isMobile"
      class="px-6 py-3 bg-red-500 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      I sent you a love letter! 💌
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const loadingMessage = ref('');
const isMobile = ref(false);

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

const messages = [
  "Writing with love... 💝",
  "Adding some sparkles... ✨",
  "Sealing with a kiss... 💋",
  "Almost ready... 💌"
];

const updateLoadingMessage = () => {
  let messageIndex = 0;
  loadingMessage.value = messages[0];
  
  const intervalId = setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    loadingMessage.value = messages[messageIndex];
  }, 1000);

  return intervalId;
};

const handleClick = async () => {
  if (isMobile.value) return;
  
  try {
    isLoading.value = true;
    localStorage.setItem('fromHome', 'true');
    
    const intervalId = updateLoadingMessage();
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    clearInterval(intervalId);
    await router.push('/love');
  } catch (error) {
    console.error('Navigation error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>