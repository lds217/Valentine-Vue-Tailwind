<script setup>
  import { ref, onMounted } from "vue";
  import { useIntersectionObserver } from '@vueuse/core'
  import PlacesMap from '/src/components/utils/PlacesMap.vue'
  import SideNav from '/src/components/utils/SideNav.vue'
  import Timeline from '/src/components/utils/Timeline.vue'
  import backgroundImage from '@/assets/img/3.jpg'
  import audio from '@/assets/audio/Spring_Snow.mp3'
  import { Play, Pause, Volume2 } from 'lucide-vue-next';
  const days = ref(0);
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);
  const years = ref(0);
  const months = ref(0);
  const isPlaying = ref(true);
  const audioPlayer = ref(1);
  const progressBar = ref(0); 
  const volume = ref(1); 
  const currentTrackIndex = ref(0);
  
  // List of audio app
  const tracks = [
    audio,
  ];

  // Play/Pause control
  const toggleAudio = () => {
    if (audioPlayer.value.paused) {
      audioPlayer.value.play();
      isPlaying.value = true;
    } else {
      audioPlayer.value.pause();
      isPlaying.value = false;
    }
  };

  // Update progress bar
  const updateProgress = () => {
    const duration = audioPlayer.value.duration;
    const currentTime = audioPlayer.value.currentTime;
    progressBar.value = (currentTime / duration) * 100;
  };

  // Update volume
  const updateVolume = (event) => {
    volume.value = event.target.value;
    audioPlayer.value.volume = volume.value;
  };


  const startDate = new Date("2024-01-14T00:07:00Z"); // UTC time
  startDate.setHours(startDate.getHours() + 7);
  let finalDays = 0;

  // Method to calculate the time difference
  const calculateTime = () => {
  const now = new Date(); // Current time
  const timeDifference = now - startDate; // Difference in milliseconds

  // Convert milliseconds to days, hours, minutes, and seconds
  finalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const remainingMs = timeDifference % (1000 * 60 * 60 * 24);

  hours.value = Math.floor(remainingMs / (1000 * 60 * 60));
  minutes.value = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((remainingMs % (1000 * 60)) / 1000);
};

const animateDays = () => {
  let interval = setInterval(() => {
    if (days.value < finalDays) {
      days.value++;
    } else {
      clearInterval(interval);
    }
  }, 10); 
};

const imageModules = import.meta.glob('@/assets/img/gallery/*.{jpg,jpeg,png,gif,webp}', { eager: true });
const images = ref([]);
const isVisible = ref(false);
const gallerySection = ref(null);

onMounted(() => {
  // Extract URLs from the modules
  images.value = Object.values(imageModules).map(module => module.default);
  
  // Set up intersection observer to trigger animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  if (gallerySection.value) {
    observer.observe(gallerySection.value);
  }

  // If no intersection observer support or immediate visibility needed,
  // uncomment the following line:
  // isVisible.value = true;
});


  // Call the method to calculate initial time
  onMounted(() => {
    calculateTime();
    // Update the countdown every second
    setInterval(calculateTime, 1000);
    animateDays();

    audioPlayer.value.src = tracks[currentTrackIndex.value];
    audioPlayer.value.addEventListener('timeupdate', updateProgress);

    if (localStorage.getItem('fromHome') === 'true') {
      // Set volume to 0.5
      audioPlayer.value.volume = 0.5;
      volume.value = 0.5;
      // Play audio
      audioPlayer.value.play();
      // Clear the flag
      localStorage.removeItem('fromHome');
    }
  });

  // Smooth scroll to sections
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };


  // Fixed sections implementation
  const sectionRefs = ref([]);

  const observeSection = (el) => {
    if (!el) return;
    
    const { stop } = useIntersectionObserver(
      el,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
        }
      },
      { threshold: 0.3 }
    );
  };

  onMounted(() => {
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => {
      sectionRefs.value.push(section);
      observeSection(section);
    });
    
  });

  const selectedImage = ref(null);
const showModal = ref(false);

const openImage = (image) => {
  selectedImage.value = image;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedImage.value = null;
};

</script>


<template class="bg-pink-50">
  <div class="bg-pink-200 min-h-screen">
    <!--Navbar -->
    <SideNav :scrollToSection="scrollToSection" />

    <div>
    <!-- "We've been together" Section -->
    <section
      id="together"
      data-section
      class="min-h-screen items-center justify-center bg-gradient-to-r from-pink-300 to-red-400 text-white flex flex-col transform opacity-0 transition-all duration-700 ease-out"
    >
      <div class="absolute inset-0 bg-cover bg-center opacity-20" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
      <div class="w-full text-center my-8">
        <h2 data-section  class="text-4xl font-bold transform opacity-0  translate-y-10 transition-all duration-700 ease-out">💕 We've been together for 💕</h2>
      </div>
      <div class="flex justify-center items-center w-full px-8">
        
        <div class="flex-none w-1/3 text-center">
          <div class="relative w-40 h-40 mx-auto border-4 border-white rounded-full overflow-hidden">
            <img
              src="@/assets/img/avt3.jpg"
              alt="Couple"
              class="w-full h-full object-cover transform scale-160 translate-x transform: translateY(-50);"
            />
          </div>


          <p class="text-xl font-semibold mt-4">Lê Thành Đạt</p>
          <p class="text-lg text-gray-200"><span class="font-semibold">June 5, 2006</span></p>
        </div>

        <!-- Middle Section: Countdown & Message -->
        <div class="flex-1 text-center p-10">
          <p class="text-lg mt-4">Our love story began on <span class="font-semibold">January 14, 2024</span>. Every day since then has been magical. ✨</p>

          <div class="mt-6">
            <p class="text-2xl">
              <span class="font-bold text-4xl">{{ days }} days </span> 
              <span class="font-bold text-2xl">{{ hours }} hours </span> 
              <span class="font-bold text-2xl">{{ minutes }} minutes </span> 
              <span class="font-bold text-2xl">{{ seconds }} seconds</span>
            </p>
            <p class="text-lg mt-2">since we met. Every moment has been a treasure. 💖</p>
          </div>
          
        </div>

        <!-- Right Section: Circular Image -->
        <div class="flex-none w-1/3 text-center">
          <div class="relative w-40 h-40 mx-auto border-4 border-white rounded-full overflow-hidden">
            <img
              src="@/assets/img/avt2.jpg"
              alt="Couple"
              class="w-full h-full object-cover transform scale-110 translate-x-2 translate-y--2"
            />
          </div>


          <p class="text-xl font-semibold mt-4">Phan Đặng Quỳnh Linh</p>
          <p class="text-lg text-gray-200"><span class="font-semibold">July 21, 2005</span></p>
        </div>

      </div>
    </section>
  </div>
    <!-- "We met" Section -->
    <section id="timeline" data-section  class="opacity-0 transform translate-y-0 transition-all duration-700 ease-out">
    <Timeline />
  </section>
     <!-- 🌍 "Places we've been" Section -->
      <section id="places" class="pb-32">
     <PlacesMap />
    </section>

    <!-- "Gallery" Section -->
    <section
    id="gallery"
    ref="gallerySection"
    :class="['min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 transform transition-all duration-700 ease-out', 
             isVisible ? 'opacity-100' : 'opacity-0']"
  >
    <h2 class="text-4xl font-bold text-red-500 mb-12 pt-6 text-center">
      📸 Our Beautiful Memories 📸
    </h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full max-w-7xl mx-auto">
      <div
        v-for="(image, index) in images"
        :key="index"
        :class="['aspect-[4/5] relative group overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-700 ease-out transition-transform duration-500 ease-out',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
        :style="{ transitionDelay: `${index * 100}ms` }"
        @click="openImage(image)"
      >
        <img
          :src="image"
          class="w-full h-full object-cover absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
          alt="Gallery image"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600 ease-in-out">
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-in-out">
          </div>
        </div>
      </div>
    </div>
  </section>

          <!-- Image Modal/Lightbox -->
<div 
  v-if="showModal" 
  class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
  @click="closeModal"
>
  <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl mx-auto px-4">
    <img 
      :src="selectedImage" 
      class="w-full h-auto object-contain rounded-lg"
      @click.stop
    >
    <button 
      @click="closeModal"
      class="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2 hover:bg-red-400 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</div>

    <div>
  <!-- Audio Player -->
  <div class="fixed bottom-8 right-0 transform -translate-x-10 bg-white rounded-lg shadow-lg p-4 z-50">
    <div class="flex items-center justify-center space-x-4">
      <!-- Play/Pause Button -->
      <button @click="toggleAudio" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 flex items-center justify-center group">
        <Play 
          v-if="!isPlaying" 
          class="w-5 h-5 transition-transform duration-200 ease-in-out group-hover:scale-110" 
        />
        <Pause 
          v-else 
          class="w-5 h-5 transition-transform duration-200 ease-in-out group-hover:scale-110" 
        />
      </button>
      
      <!-- Progress Bar -->
      <input
        type="range"
        min="0"
        max="100"
        v-model="progressBar"
        @input="audioPlayer.value.currentTime = (progressBar / 100) * audioPlayer.value.duration"
        class="w-40"
      />

      <!-- Volume Button and Slider -->
      <div class="relative group flex items-center justify-center">
        <!-- Volume Button -->
        <button  class="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 flex items-center justify-center">
          <Volume2 class="w-5 h-5" />
        </button>

        <!-- Vertical Volume Slider -->
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          v-model="volume"
          @input="updateVolume"
          class="volume-slider absolute bottom-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
    <!-- Audio Player -->
    <audio ref="audioPlayer" class="hidden"></audio>
  </div>
</div>

    <!-- Footer -->
<footer class="bg-red-500 text-white py-4">
  <div class="container mx-auto px-4 text-center">
    <p class="mb-3">💖 Made with love for my Valentine 💖</p>
    
    <!-- Credits with Icons -->
    <div class="flex flex-col items-center gap-2">
      <p class="text-sm">
        Made by 
        <a href="https://github.com/lds217" target="_blank" rel="noopener noreferrer" class="inline-flex items-center hover:text-pink-200">
          lds217
          <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        , inspiration from 
        <a href="https://github.com/tiennm99" target="_blank" rel="noopener noreferrer" class="inline-flex items-center hover:text-pink-200">
          tienm99
          <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </p>
      
      <!-- Social Media Links -->
      <div class="flex space-x-4 mt-2">
        <a href="https://github.com/lds217/Valentine-Vue-Tailwind" target="_blank" rel="noopener noreferrer" class="hover:text-pink-200">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/ldss21/" target="_blank" rel="noopener noreferrer" class="hover:text-pink-200">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
        <a href="https://instagram.com/lds.lt" target="_blank" rel="noopener noreferrer" class="hover:text-pink-200">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>
  </div>
</template>

<style scoped>
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

.fixed {
  position: fixed;
}

.z-50 {
  z-index: 50;
}

/* Ensure smooth visibility transition */
.group:hover .volume-slider {
  opacity: 1;
}

/* Ensure smooth visibility transition */
.group:hover .volume-slider {
  opacity: 1;
}

/* Adjust the position and size of the volume slider */
.volume-slider {
  width: 60px; 
  height: 120px; 
  transform: rotate(270deg);
  position: absolute;
  bottom: 20px; 
  left: -12px; 
  transition: opacity 0.3s ease-in-out;
}

.group:hover .volume-slider {
  opacity: 1; /* Make the slider visible on hover */
}

.opacity-0 {
  opacity: 0;
}

.translate-y-10 {
  transform: translateY(10px);
}

.opacity-100 {
  opacity: 1;
}

.translate-y-0 {
  transform: translateY(0);
}

.transition-all {
  transition: opacity 1s ease-out, transform 1s ease-out;
}


</style>
