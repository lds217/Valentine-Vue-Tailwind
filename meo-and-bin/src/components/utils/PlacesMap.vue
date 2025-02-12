<script setup>
import { ref, onMounted } from "vue";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const showModal = ref(false);
const modalContent = ref({});

// South Vietnam coordinates
const defaultCenter = [10.7769, 106.7009];
const defaultZoom = 6;

import image1 from '@/assets/img/1.jpg';
import { name } from "@vue/eslint-config-prettier/skip-formatting";

const regions = {
  southVietnam: {
    center: [10.7769, 106.7009],
    zoom: 7,
    minZoom: 8,
    maxZoom: 11,
    bounds: [
      [8.5, 104.5],  
      [12.5, 109.5]  
    ]
  },
  centralUSA: {
    center: [41.5, -89],
    zoom: 5,
    minZoom: 5,
    maxZoom: 7,
    bounds: [
      [36, -98],  // Southwest
      [47, -80]   // Northeast
    ]
  }
};

// Vietnamese locations
const vietnamPlaces = [
  {
    name: 'Ho Chi Minh City',
    coordinates: [10.7769, 106.7009],
    description: 'Where our story began. The bustling metropolis of Southern Vietnam.',
    image: image1,
    date: 'January 2024'
  },

  {
    name: 'Le Chanh Village',
    coordinates: [10.735306, 105.167250],
    description: 'Beautiful coastal city where we watched the sunset together.',
    image: 'https://source.unsplash.com/400x300/?vung-tau',
    date: 'March 2024'
  },
  {
    name: 'Duc Hoa Village',
    coordinates: [10.8237, 106.457239],
    description: 'The city of eternal spring, where we enjoyed the cool weather and beautiful flowers.',
    image: 'https://source.unsplash.com/400x300/?dalat',
    date: 'May 2024'
  },
  {
    name: 'Giga Mall',
    coordinates: [10.82755, 106.72178],
    description: 'The paradise island where we enjoyed the sun and sea.',
    image: 'https://source.unsplash.com/400x300/?phu-quoc',
    date: 'July 2024'
  },
  {
    name: 'Glamping',
    coordinates: [10.867987, 106.84186],
    description: 'The bustling market where we enjoyed shopping and local food.',
    image: 'https://source.unsplash.com/400x300/?ben-thanh-market',
    date: 'September 2024'
  },
  {
    name: 'Di An District',
    coordinates: [10.920968, 106.7796],
    description: 'The bustling market where we enjoyed shopping and local food.',
    image: 'https://source.unsplash.com/400x300/?ben-thanh-market',
    date: 'November 2024'
  },
  {
    name: 'Ben Cat City',
    coordinates: [11.1304262, 106.62300],
    description: 'The bustling market where we enjoyed shopping and local food.',
    image: 'https://source.unsplash.com/400x300/?ben-thanh-market',
    date: 'November 2024'
  },
  {
    name: 'Phan Dien Village',
    coordinates: [11.29774849, 108.517254],
    description: 'The bustling market where we enjoyed shopping and local food.',
    image: 'https://source.unsplash.com/400x300/?ben-thanh-market',
    date: 'November 2024'
  },
];

// US locations
const usPlaces = [
  {
    name: 'Minneapolis, Minnesota',
    coordinates: [45.167787, -93.2117390],
    description: 'The vibrant Twin Cities with beautiful lakes.',
    image: 'https://source.unsplash.com/400x300/?minneapolis',
    date: 'April 2024'
  },
  {
    name: 'Purdue Indianapolis',
    coordinates: [39.77414, -86.172488],
    description: 'The crossroads of America.',
    image: 'https://source.unsplash.com/400x300/?indianapolis',
    date: 'May 2024'
  },
  {
    name: 'Columbus, Ohio',
    coordinates: [39.965158, -83.0069],
    description: 'The heart of it all.',
    image: 'https://source.unsplash.com/400x300/?columbus-ohio',
    date: 'June 2024'
  },
  {
    name: 'Denision University',
    coordinates: [40.367474, -82.774856],
    description: 'The beautiful campus in Ohio.',
    image: 'https://source.unsplash.com/400x300/?denison-university',
    date: 'June 2024'
  }
];

let vietnamMap = null;
let usMap = null;
let currentTileLayer = {};

const openModal = (place) => {
  modalContent.value = place;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const resizeImage = (imageUrl, maxWidth = 40, maxHeight = 40) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";  // Handle CORS issues
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
};

const createPinIcon = async (imageUrl) => {
  try {
    const resizedImageUrl = await resizeImage(imageUrl);
    return L.divIcon({
      html: `
        <div data-section class="marker-wrapper opacity-0 transform translate-y-10 transition-all duration-700 ease-out">
          <img class="outline-2 outline-offset-2 outline-pink-500 rounded-md w-8 h-8 object-cover" src="${resizedImageUrl}" alt="location" />
        </div>
      `,
      className: 'custom-photo-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  } catch (error) {
    console.error('Error resizing image:', error);
    return L.divIcon({
      html: `
        <div data-section class="marker-wrapper opacity-0 transform translate-y-10 transition-all duration-700 ease-out">
          <img class="outline-2 outline-offset-2 outline-pink-500 w-8 h-8 object-cover" src="${imageUrl}" alt="location" />
        </div>
      `,
      className: 'custom-photo-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }
};

// Modified initializeMap function to handle intersection observer
const initializeMap = async (elementId, config, places) => {
  const map = L.map(elementId, {
    center: config.center,
    zoom: config.zoom,
    minZoom: config.minZoom,
    maxZoom: config.maxZoom,
    maxBounds: config.bounds,
    maxBoundsViscosity: 1.0,
    zoomControl: false,
    dragging: true,
    touchZoom: false,
    scrollWheelZoom: true,
  });

  currentTileLayer[elementId] = L.tileLayer(
    'https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=4Qb1L2PTgRCU1aSwKq2D',
    {
      attribution: '© MapTiler',
      maxZoom: config.maxZoom,
      minZoom: config.minZoom
    }
  ).addTo(map);

  // Add markers with intersection observer
  for (const place of places) {
    const icon = await createPinIcon(place.image);
    const marker = L.marker(place.coordinates, { icon })
      .addTo(map)
      .on('click', () => openModal(place));
    
    // Get the marker element after it's added to the map
    const markerElement = marker.getElement();
    if (markerElement) {
      const markerWrapper = markerElement.querySelector('.marker-wrapper');
      if (markerWrapper) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              markerWrapper.classList.remove('opacity-0', 'translate-y-10');
              markerWrapper.classList.add('opacity-100', 'translate-y-0');
            }
            else {
              markerWrapper.classList.remove('opacity-100', 'translate-y-0');
              markerWrapper.classList.add('opacity-0', 'translate-y-10');
            }

          },
          { threshold: 0.3 }
        );
        observer.observe(markerWrapper);
      }
    }
  }

  return map;
};

// Update onMounted to handle async initialization
onMounted(() => {
  setTimeout(async () => {
    vietnamMap = await initializeMap('vietnam-map', regions.southVietnam, vietnamPlaces);
    usMap = await initializeMap('us-map', regions.centralUSA, usPlaces);
  }, 100);
});
</script>

<template class>
  <div class="maps-container py-12  px-4">
    <!-- Vietnam Section -->
    <section
      id="places-vn"
      data-section
      class="relative min-h-[600px] mb-12 opacity-0 transform translate-y-10 transition-all duration-700 ease-out"
    >
      <!-- Decorative Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-pink-100 to-red-100 rounded-3xl shadow-xl overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-hearts opacity-5"></div>
      </div>

      <!-- Content Container -->
      <div class="relative z-10 p-8">
        <h2 class="text-4xl font-bold text-red-800 text-center mb-8">
          🌍 Our Journey in Vietnam 🌍
        </h2>

        <!-- Map Container -->
        <div class="map-wrapper relative mx-auto">
          <div class="heart-border">
            <div id="vietnam-map" class="w-full h-[400px] rounded-3xl overflow-hidden"></div>
          </div>
          
          <!-- Decorative Elements -->
          <div class="absolute -top-4 -left-4 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-xl">❤️</div>
          <div class="absolute -bottom-4 -right-4 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-xl">❤️</div>
        </div>

        <p class="text-lg mt-8 text-red-800 text-center">Where our love story began 💞</p>
      </div>
    </section>

    <!-- USA Section -->
    <section
      id="places-usa"
      data-section
      class="relative min-h-[600px] opacity-0 transform  translate-y-10 transition-all duration-700 ease-out "
    >
      <!-- Decorative Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-100 to-purple-100 rounded-3xl shadow-xl overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-stars opacity-5"></div>
      </div>

      <!-- Content Container -->
      <div class="relative z-10 p-8">
        <h2 class="text-4xl font-bold text-blue-800 text-center mb-8">
          🗽 Our American Adventures 🗽
        </h2>

        <!-- Map Container -->
        <div class="map-wrapper relative mx-auto">
          <div class="heart-border blue">
            <div id="us-map" class="w-full h-[400px] rounded-3xl overflow-hidden"></div>
          </div>
          
          <!-- Decorative Elements -->
          <div class="absolute -top-4 -left-4 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-xl">💫</div>
          <div class="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-xl">💫</div>
        </div>

        <p class="text-lg mt-8 text-blue-800 text-center">Creating memories across the States 💫</p>
      </div>
    </section>
  </div>

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="showModal" 
         class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
         @click.self="closeModal">
      <div class="bg-white p-6 rounded-lg w-96 max-w-lg transform transition-all duration-300 scale-100">
        <div class="relative">
          <h3 class="text-2xl font-bold text-center text-pink-600 mb-4">{{ modalContent.name }}</h3>
          <img :src="modalContent.image" 
               :alt="modalContent.name"
               class="w-full h-48 object-cover rounded-lg shadow-md">
          <p class="mt-4 text-gray-700">{{ modalContent.description }}</p>
          <p class="mt-2 text-sm text-pink-500">Visited: {{ modalContent.date }}</p>
          <button @click="closeModal" 
                  class="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg w-full hover:bg-pink-600 transition-colors">
            Close
          </button>
          
          <!-- Decorative hearts -->
          <div class="absolute -top-2 -left-2 text-pink-400 text-xl">❤️</div>
          <div class="absolute -top-2 -right-2 text-pink-400 text-xl">❤️</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.maps-container {
  max-width: 1200px;
  margin: 0 auto;
}

.map-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.heart-border {
  position: relative;
  padding: 20px;
  background: linear-gradient(45deg, #fce7f3, #fbcfe8);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.heart-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 4px;
  background: linear-gradient(45deg, #f472b6, #ec4899, #db2777);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.heart-border.blue {
  background: linear-gradient(45deg, #dbeafe, #bfdbfe);
}

.heart-border.blue::before {
  background: linear-gradient(45deg, #60a5fa, #3b82f6, #2563eb);
}

.custom-pin {
  color: #ec4899; /* Changed to pink-500 */
  transition: transform 0.3s ease;
}

.custom-pin:hover {
  transform: scale(1.2);
}

.heart-pin {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}


/* Background Patterns */
.bg-hearts {
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23ec4899'/%3E%3C/svg%3E");
}

.bg-stars {
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z' fill='%233b82f6'/%3E%3C/svg%3E");
}

:deep(.leaflet-container) {
  background-color: rgba(255, 192, 203, 0.2);
}

:deep(.leaflet-control-container) {
  display: none;
}

.marker-wrapper {
  transition: all 0.7s ease-out;
}

.marker-wrapper:hover img {
  transform: scale(1.2);
  transition: transform 0.3s ease;
}

.custom-photo-pin {
  background: transparent;
  border: none;
}

</style>