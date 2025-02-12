<script setup>
  import { ref, onMounted } from "vue";
  import { useIntersectionObserver } from '@vueuse/core'
  const days = ref(0);
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);
  const years = ref(0);
  const months = ref(0);

  const audioPlayer = ref(1);
  const progressBar = ref(0); // Progress bar value
  const volume = ref(1); // Volume level (0 to 1)
  const currentTrackIndex = ref(0);
  
  // List of audio app
  const tracks = [
    "src/assets/audio/Spring_Snow.mp3",
  ];

  // Play/Pause control
  const toggleAudio = () => {
    if (audioPlayer.value.paused) {
      audioPlayer.value.play();
    } else {
      audioPlayer.value.pause();
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

  // Set initial track when the component is mounted
  onMounted(() => {
    audioPlayer.value.src = tracks[currentTrackIndex.value];
    audioPlayer.value.addEventListener('timeupdate', updateProgress);
  });

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
  years.value = Math.floor(days.value / 365);
  months.value = Math.floor((days.value / 365) * 12 + (days.value % 365)/30);
};

const animateDays = () => {
  let interval = setInterval(() => {
    if (days.value < finalDays) {
      days.value++;
    } else {
      clearInterval(interval);
    }
  }, 10); // Adjust speed (lower = faster)
};

  const images = [
    new URL('@/assets/img/1.jpg', import.meta.url).href,
    new URL('@/assets/img/2.jpg', import.meta.url).href,
    new URL('@/assets/img/3.jpg', import.meta.url).href,
    new URL('@/assets/img/4.jpg', import.meta.url).href,
    new URL('@/assets/img/5.jpg', import.meta.url).href,
    new URL('@/assets/img/4.jpg', import.meta.url).href,
  ];

  // Call the method to calculate initial time
  onMounted(() => {
    calculateTime();
    // Update the countdown every second
    setInterval(calculateTime, 1000);
    animateDays();
  });

  // Smooth scroll to sections
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  // Modal state and content
  const showModal = ref(false);
  const modalContent = ref('');

  const places = [
  { name: 'Paris', image: 'https://source.unsplash.com/400x300/?paris', description: 'The city of love.' },
  { name: 'Tokyo', image: 'https://source.unsplash.com/400x300/?tokyo', description: 'A blend of modernity and tradition.' },
  { name: 'New York', image: 'https://source.unsplash.com/400x300/?new-york', description: 'The city that never sleeps.' },
  ];


  // Show modal function
  const openModal = (place) => {
    modalContent.value = place.description;
    showModal.value = true;
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
        else {
          el.classList.remove('opacity-100', 'translate-y-0');
        }
      },
      { threshold: 0.3 }
    );
  };

  onMounted(() => {
    // Get all sections with ref="sectionRef"
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => {
      sectionRefs.value.push(section);
      observeSection(section);
    });
  });

</script>


<template class="bg-pink-50">
  <div class="bg-pink-50 min-h-screen">
    <!--Navbar -->
    <nav class="fixed top-0 left-0 w-full bg-red-500 text-white py-4 shadow-md z-50">
      <ul class="flex justify-center space-x-6 text-lg font-semibold">
        <li><button @click="scrollToSection('together')" class="hover:text-yellow-300">We've been together</button></li>
        <li><button @click="scrollToSection('met')" class="hover:text-yellow-300">We met</button></li>
        <li><button @click="scrollToSection('places')" class="hover:text-yellow-300">We've been together to</button></li>
        <li><button @click="scrollToSection('gallery')" class="hover:text-yellow-300">Gallery</button></li>
      </ul>
    </nav>

    <div>
    <!-- "We've been together" Section -->
    <section
      id="together"
      
      class="min-h-screen items-center justify-center bg-gradient-to-r from-pink-300 to-red-400 text-white flex flex-col "
    >
      <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('src/assets/img/3.jpg');"></div>
      <div class="w-full text-center my-8">
        <h2 data-section  class="text-4xl font-bold transform opacity-0  translate-y-10 transition-all duration-700 ease-out">💕 We've been together for 💕</h2>
      </div>
      <div class="flex justify-center items-center w-full px-8">
        
        <div class="flex-none w-1/3 text-center">
          <div class="relative w-40 h-40 mx-auto border-4 border-white rounded-full overflow-hidden">
            <img
              src="@/assets/img/avt1.jpg"
              alt="Couple"
              class="w-full h-full object-cover transform scale-110 translate-x translate-y-2"
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
            <p>
              <span class="font-bold text-2xl">{{ years }} year</span> 
              <br>
              <span class="font-bold text-2xl">{{ months }} months</span>
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


     <!-- 🌍 "Places we've been" Section -->
    <div>
      <section
        id="places"
        data-section
        class="min-h-screen flex items-center justify-center bg-pink-200 text-red-800 opacity-0 transform translate-y-10 transition-all duration-700 ease-out"
      >
        <div class="text-center p-10">
          <h2 class="text-4xl font-bold">🌍 We've been together to 🌍</h2>
          <p class="text-lg mt-4">From the first trip to the cozy dates, every place we've visited has a piece of our love. 💞</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div
              v-for="(place, index) in places"
              :key="index"
              class="relative"
            >
              <img :src="place.image" class="w-full h-48 object-cover rounded-lg shadow-lg" />
              <button @click="openModal(place)" class="absolute top-1 right-1 text-white bg-red-500 rounded-full p-2">
                ❤️
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg w-1/3">
          <h3 class="text-2xl font-bold text-center">More About This Place</h3>
          <p class="mt-4">{{ modalContent }}</p>
          <button @click="closeModal" class="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- "Gallery" Section -->
    <section
      id="gallery"
      data-section
      class="min-h-screen flex flex-col items-center justify-center bg-white p-6 opacity-0 transform translate-y-10 transition-all duration-700 ease-out"
    >
      <h2 class="text-4xl font-bold text-red-500 mb-6">📸 Our Beautiful Memories 📸</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        <img 
          v-for="(image, index) in images" 
          :key="index" 
          :src="image" 
          class="w-full h-auto object-cover rounded-lg shadow-lg"
        >
      </div>
    </section>

    <div class="min-h-screen">
      <!-- Audio Player -->
      <div class="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 flex flex-row items-center space-x-4 z-50">
        
        <!-- Play/Pause Button -->
        <button @click="toggleAudio" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 mb-2">
          <span v-if="audioPlayer.value?.paused">▶️</span>
          <span v-else>⏸️</span>
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
        <div class="relative group flex items-center space-x-2">
          <!-- Volume Button -->
          <button @click="updateVolume({ target: { value: volume.value - 0.1 } })" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-400">
            🔊
          </button>

          <!-- Vertical Volume Slider (appears only on hover) -->
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            v-model="volume"
            @input="updateVolume"
            class="volume-slider absolute bottom-12 opacity-1 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>


        <!-- Audio Player -->
        <audio ref="audioPlayer" class="hidden"></audio>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-red-500 text-white text-center py-4">
      <p>💖 Made with love for my Valentine 💖</p>
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
  width: 60px; /* Make the slider wider so it’s visible */
  height: 120px; /* Set the height of the slider */
  transform: rotate(270deg); /* Rotates the slider to make it vertical */
  position: absolute;
  bottom: 20px; /* Adjust to position it correctly */
  left: -12px; /* Adjust to position it correctly */
  transition: opacity 0.3s ease-in-out; /* Smooth transition for opacity */
}

.group:hover .volume-slider {
  opacity: 1; /* Make the slider visible on hover */
}

.opacity-0 {
  opacity: 0;
}

.translate-y-10 {
  transform: translateY(40px);
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
