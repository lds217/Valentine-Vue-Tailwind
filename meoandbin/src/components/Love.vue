<script setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
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

const hearts = ref([]);
const heartSVGContent = ref(`<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`);

const initialHeartCount = ref(15);
const maxHeartCount = ref(75);
const currentHeartId = ref(0);
let heartAddInterval = null;

// Function to set random properties for a heart
const randomizeHeartProperties = (heart) => {
  const randomSize = Math.random() * 25 + 15; // Hearts size: 15px to 40px (previously 10px to 30px)
  heart.left = `${Math.random() * 95}%`; // Horizontal position (0-95% to keep it on screen)
  heart.initialTop = '100vh'; // Start at the bottom of the viewport
  heart.size = `${randomSize}px`;
  heart.color = `rgba(236, 72, 153, ${Math.random() * 0.3 + 0.2})`; // Softer colors
  heart.animationDuration = `${Math.random() * 8 + 7}s`; // Animation duration 7s to 15s
  heart.animationDelay = `${Math.random() * 5}s`; // Staggered start up to 5s
  heart.baseOpacity = Math.random() * 0.4 + 0.3; // Base opacity for CSS animation (0.3 to 0.7)
  // parallaxFactor is removed
};

// Function to initialize hearts
const initializeHearts = () => {
  const newHearts = [];
  for (let i = 0; i < initialHeartCount.value; i++) {
    const heart = { id: currentHeartId.value++ }; // Assign and increment ID
    randomizeHeartProperties(heart);
    newHearts.push(heart);
  }
  hearts.value = newHearts;
};

const attachAnimationListener = (heartElement, heartObject) => {
  heartElement.addEventListener('animationiteration', () => {
    const currentHeartInArray = hearts.value.find(h => h.id === heartObject.id);
    if (currentHeartInArray) {
      randomizeHeartProperties(currentHeartInArray);
      heartElement.style.left = currentHeartInArray.left;
      heartElement.style.width = currentHeartInArray.size;
      heartElement.style.height = currentHeartInArray.size;
      heartElement.style.color = currentHeartInArray.color;
      heartElement.style.animationDuration = currentHeartInArray.animationDuration;
      heartElement.style.setProperty('--base-opacity', currentHeartInArray.baseOpacity);
      heartElement.style.animationName = 'none';
      void heartElement.offsetWidth;
      heartElement.style.animationName = 'heart-float-up-animation';
      heartElement.style.animationDelay = '0s';
    }
  });
};

const addNewHeart = () => {
  if (hearts.value.length < maxHeartCount.value) {
    const newHeartObject = { id: currentHeartId.value++ }; // Assign and increment ID
    randomizeHeartProperties(newHeartObject);
    hearts.value.push(newHeartObject);

    nextTick(() => {
      const newHeartElement = document.getElementById(`heart-${newHeartObject.id}`);
      if (newHeartElement) {
        // Set initial animation delay for the new heart to appear staggered
        newHeartElement.style.animationDelay = newHeartObject.animationDelay;
        attachAnimationListener(newHeartElement, newHeartObject);
      }
    });
  }
};

onMounted(() => {
  initializeHearts();

  nextTick(() => {
    hearts.value.forEach(heart => {
      const element = document.getElementById(`heart-${heart.id}`);
      if (element) {
        attachAnimationListener(element, heart); // Use the new helper
      }
    });
  });

  // Start interval to add new hearts
  heartAddInterval = setInterval(() => {
    addNewHeart();
  }, 3000); // Add a new heart every 3 seconds, for example
});

onBeforeUnmount(() => {
  if (heartAddInterval) {
    clearInterval(heartAddInterval);
  }
  // Clean up animation iteration listeners - this part remains tricky with anonymous listeners
  // Consider named functions or a more robust event management if this becomes an issue.
});


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

const scrapbookEntries = ref([]);

onMounted(() => {
  const scrapbookObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Add random delay class
          const randomDelay = Math.floor(Math.random() * 3);
          entry.target.classList.add(`delay-${randomDelay}`);
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '-50px 0px'
    }
  );

  // Observe all scrapbook entries
  scrapbookEntries.value = document.querySelectorAll('.scrapbook-entry');
  scrapbookEntries.value.forEach(entry => {
    scrapbookObserver.observe(entry);
  });
});

</script>


<template class="bg-pink-50">
  <div class="min-h-screen bg-gradient-to-b from-pink-300 to-red-350"> <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div
        v-for="heart in hearts"
        :key="heart.id"
        :id="'heart-' + heart.id"
        class="floating-heart"
        :style="{
          left: heart.left,
          top: heart.initialTop,
          width: heart.size,
          height: heart.size,
          color: heart.color,
          animationDuration: heart.animationDuration,
          '--base-opacity': heart.baseOpacity,
          /* transform for parallax is applied by JS */
        }"
        v-html="heartSVGContent"
      ></div>
    </div>

    <SideNav :scrollToSection="scrollToSection" class="relative z-20" />

    <div class="relative z-10">
      <section
        id="together"
        data-section
        class="min-h-screen items-center justify-center bg-gradient-to-r from-pink-300 to-red-350 text-white flex flex-col transform opacity-0 transition-all duration-700 ease-out"
      >
        <div class="absolute inset-0 bg-cover bg-center opacity-20" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
        <div class="w-full text-center my-8">
          <h2 data-section class="text-4xl font-bold transform opacity-0 translate-y-10 transition-all duration-700 ease-out">💕 We've been together for 💕</h2>
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
  <section id="timeline" data-section  class="opacity-0 transform translate-y-0 transition-all duration-700 ease-out">
  <Timeline />
</section>
    <section id="places" class="pb-32">
    <PlacesMap />
  </section>

  <section id="scrapbook" class="min-h-screen py-16">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-bold text-pink-600 mb-4 hover:text-pink-500 transition-colors duration-300">Our 500 days Love Story Scrapbook 📖</h2>
      <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">You make scrapbook I make comments</p>
    </div>
    <div class="container mx-auto px-4">
      <div class="space-y-32">
        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-8xl font-bold mb-4 text-pink-600">FULL OF LOVE</h3>
                <p class="text-gray-600">Bin and Meo</p>
                <p class="text-gray-600">Why you so cute in this picture? I wish I could be photogenic like you </p>
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-1.jpg" alt="Memory 1" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
          </div>
        </div>

        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-2.jpg" alt="Memory 2" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-6xl font-bold mb-4 text-pink-600">When it started?</h3>
                <p class="text-gray-600">Travel for more than 1 hour, we all did it. You taught me how to travel by bus. You help me to be brave and confident so I can ride a motorbike... I was so scared lol</p>
              </div>
            </div>
          </div>
        </div>

        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-6xl font-bold mb-4 text-pink-600">Beautiful Adventures</h3>
                <p class="text-gray-600">We have been through many changes, many challenges, but we always together</p>
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-3.jpg" alt="Memory 3" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
          </div>
        </div>

        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-4.jpg" alt="Memory 4" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-6xl font-bold mb-4 text-pink-600">Cherished Times</h3>
                <p class="text-gray-600">All the songs I listen to, suddenly it all about you</p>
              </div>
            </div>
          </div>
        </div>

        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-6xl font-bold mb-4 text-pink-600">Love you Love you Love youuuuuu</h3>
                <p class="text-gray-600">Love you so much moah maoh moah</p>
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-5.jpg" alt="Memory 5" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
          </div>
        </div>

        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-6.jpg" alt="Memory 6" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-8xl font-bold mb-4 text-pink-600">I will always be there for you</h3>
                <p class="text-gray-600"></p>
              </div>
            </div>
          </div>
        </div>

        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-8xl font-bold mb-4 text-pink-600">You are the number 1 of the number one</h3>
                <p class="text-gray-600"></p>
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-7.jpg" alt="Memory 7" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
          </div>
        </div>

        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-8.jpg" alt="Memory 8" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-8xl font-bold mb-4 text-pink-600">Little thing about us!</h3>
                <p class="text-gray-600"></p>
              </div>
            </div>
          </div>
        </div>

        <div class="scrapbook-entry relative">
          <div class="absolute w-0.5 h-full bg-gradient-to-b from-pink-300 via-pink-400 to-pink-300 left-1/2 transform -translate-x-1/2"></div>
          <div class="flex items-center">
            <div class="w-1/2 pr-12">
              <div class="prose entry-content entry-text">
                <h3 class="text-8xl font-bold mb-4 text-pink-600">Love Stories</h3>
                <p class="text-gray-600"></p>
              </div>
            </div>
            <div class="w-1/2 pl-12">
              <div class="entry-content entry-image">
                <img src="@/assets/img/scrapbook/Biniuoilaiu-9.jpg" alt="Memory 9" 
                     class="rounded-lg shadow-lg w-full transform transition-transform duration-500 hover:scale-105">
              </div>
            </div>
          </div>
        </div>

        

      </div>
    </div>
  </section>

  <section
  id="gallery"
  ref="gallerySection"
  :class="['min-h-screen flex flex-col items-center justify-center px-4 py-12 transform transition-all duration-700 ease-out', 
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
<div class="fixed bottom-8 right-0 transform -translate-x-10 bg-white rounded-lg shadow-lg p-4 z-50">
  <div class="flex items-center justify-center space-x-4">
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
    
    <input
      type="range"
      min="0"
      max="100"
      v-model="progressBar"
      @input="audioPlayer.value.currentTime = (progressBar / 100) * audioPlayer.value.duration"
      class="w-40"
    />

    <div class="relative group flex items-center justify-center">
      <button  class="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 flex items-center justify-center">
        <Volume2 class="w-5 h-5" />
      </button>

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
  <audio ref="audioPlayer" class="hidden"></audio>
</div>
</div>

  <footer class="bg-red-500 text-white py-4">
<div class="container mx-auto px-4 text-center">
  <p class="mb-3">💖 Made with love for my Valentine 💖</p>
  
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

/* Enhanced Scrapbook Animations */
.scrapbook-entry {
  opacity: 0;
  transform: scale(0.92) translateY(40px);
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  perspective: 1000px;
}

.scrapbook-entry.is-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.entry-content {
  opacity: 0;
  transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.entry-text {
  transform: translateX(-30px) scale(0.9);
}

.entry-image {
  transform: translateX(30px) scale(0.9) rotate(2deg);
}

.is-visible .entry-text {
  opacity: 1;
  transform: translateX(0) scale(1);
  transition-delay: 0.2s;
}

.is-visible .entry-image {
  opacity: 1;
  transform: translateX(0) scale(1) rotate(0);
  transition-delay: 0.4s;
}

/* Random delay classes */
.delay-0 .entry-content {
  transition-delay: 0.2s;
}

.delay-1 .entry-content {
  transition-delay: 0.3s;
}

.delay-2 .entry-content {
  transition-delay: 0.4s;
}

/* Hover effects */
.entry-image img {
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.2);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.entry-image img:hover {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
}

/* Timeline line animation */
.scrapbook-entry .absolute {
  opacity: 0.4;
  transition: opacity 0.5s ease;
}

.scrapbook-entry:hover .absolute {
  opacity: 1;
}

/* Text hover effects */
.prose h3 {
  transition: color 0.3s ease;
}

.prose h3:hover {
  color: #ec4899; /* pink-500 */
}

/* Ensure smooth visibility transition */
.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.floating-heart {
  position: absolute;
  will-change: transform, opacity; /* Optimization hint for browser */
  animation-name: heart-float-up-animation; /* CHANGED animation name */
  animation-timing-function: linear; /* CHANGED for smooth continuous rise */
  animation-iteration-count: infinite;
  /* animation-duration is set inline via JS */
  /* --base-opacity is set inline via JS for the animation to use */
}

.floating-heart svg {
  display: block; /* Removes any extra space below SVG */
  width: 100%;
  height: 100%;
}

/* @keyframes heart-pulse-animation { -- OLD Animation
  0%, 100% {
    opacity: var(--base-opacity);
    transform: scale(1) rotate(-2deg); 
  }
  50% {
    opacity: calc(var(--base-opacity) * 0.6); 
    transform: scale(0.9) rotate(3deg); 
  }
} */

@keyframes heart-float-up-animation { /* NEW Animation */
  0% {
    opacity: var(--base-opacity);
    transform: translateY(0px) scale(1) translateX(0px) rotate(-2deg); /* Start state */
  }
  25% { /* Gentle sway */
    transform: translateY(-25vh) scale(0.9) translateX(10px) rotate(5deg);
  }
  50% { /* Mid-point, still visible */
    opacity: calc(var(--base-opacity) * 0.8);
    transform: translateY(-50vh) scale(0.7) translateX(-10px) rotate(-5deg);
  }
  75% { /* Start fading and shrinking more */
    opacity: calc(var(--base-opacity) * 0.4);
    transform: translateY(-75vh) scale(0.4) translateX(5px) rotate(10deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh) scale(0.1) translateX(-5px) rotate(-10deg); /* Fully disappeared and at the top */
  }
}

html {
  scroll-behavior: smooth;
}
</style>
