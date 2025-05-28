<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const showModal = ref(false);
const modalContent = ref({});

// South Vietnam coordinates
const defaultCenter = [10.7769, 106.7009];
const defaultZoom = 6;

import image1 from '@/assets/img/1.jpg';
import image3 from '@/assets/img/3.jpg';
import imagelc from '@/assets/img/lechanh.jpg';
import imagedh from '@/assets/img/476652975_1174836937652568_3112467058036108876_n.jpg';
import imageap from '@/assets/img/479539952_594429530250078_534417895570324619_n.jpg';
import imagegm from '@/assets/img/476956585_1698003264089046_8660041013912407340_n.jpg';
import imageda from '@/assets/img/476382094_1541203859876448_3379473860663129146_n.jpg';
import imagecb from '@/assets/img/476569010_9939648159398439_4803802204045569230_n.jpg';
import imagede from '@/assets/img/476615258_1009570827716654_559313607907641415_n.jpg';
import imageindy from '@/assets/img/476584319_622774403843085_4236416919287758156_n.jpg';
import bc from '@/assets/img/7c93327b-53b2-4ef2-be1b-c1a5ddf7ff3b.jpg';
import minne from '@/assets/img/476328477_890452289692416_753768545952614398_n.jpg';

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
    image: image3,
  },

  {
    name: 'Le Chanh Village',
    coordinates: [10.735306, 105.167250],
    image: imagelc,
  },
  {
    name: 'Duc Hoa Village',
    coordinates: [10.8237, 106.457239],
    image: imagedh,
  },
  {
    name: 'Giga Mall',
    coordinates: [10.82755, 106.72178],
    image: imagegm,
  },
  {
    name: 'Di An District',
    coordinates: [10.920968, 106.7796],
    image: imageda,
  },
  {
    name: 'Ben Cat City',
    coordinates: [11.1304262, 106.62300],
    image: bc,
  },
  {
    name: 'Phan Dien Village',
    coordinates: [11.29774849, 108.517254],
    image: image1,
  },
  {
    name: 'Tan Son Nhat Airport',
    coordinates: [10.816535124487752, 106.66432097904577],
    image: imageap,
  }
];

// US locations
const usPlaces = [
  {
    name: 'Minneapolis, Minnesota',
    coordinates: [45.167787, -93.2117390],
    image: minne,
  },
  {
    name: 'Purdue Indianapolis',
    coordinates: [39.77414, -86.172488],
    image: imageindy,
  },
  {
    name: 'Columbus, Ohio',
    coordinates: [39.965158, -83.0069],
    image: imagecb,
  },
  {
    name: 'Denision University',
    coordinates: [40.367474, -82.774856],
    image: imagede,
  }
];

let vietnamMap = null;
let usMap = null;
let currentTileLayer = {};

const openModal = (place) => {
  modalContent.value = place;
  showModal.value = true;
  document.body.classList.add('modal-open');
};

const closeModal = () => {
  showModal.value = false;
  document.body.classList.remove('modal-open');
};

// Clean up when component is unmounted
onUnmounted(() => {
  document.body.classList.remove('modal-open');
});

const NEW_MARKER_SIZE = 48; // New size for markers (e.g., 48px)

const resizeImage = (imageUrl, maxWidth = NEW_MARKER_SIZE, maxHeight = NEW_MARKER_SIZE) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";  
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      
      const ctx = canvas.getContext('2d');
      // Draw image maintaining aspect ratio, then crop/center if needed, or simply fill
      // For simplicity here, we just draw to fill the new size.
      // A more sophisticated approach might involve letterboxing or aspect-ratio-preserving fill.
      ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
      
      resolve(canvas.toDataURL('image/jpeg', 0.85)); // Slightly higher quality for larger images
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
        <div class="marker-wrapper"> 
          <img class="outline-2 outline-offset-2 outline-pink-500 rounded-lg w-${NEW_MARKER_SIZE/4} h-${NEW_MARKER_SIZE/4} object-cover shadow-lg" src="${resizedImageUrl}" alt="location" />
        </div>
      `,
      className: 'custom-photo-pin',
      iconSize: [NEW_MARKER_SIZE, NEW_MARKER_SIZE],
      iconAnchor: [NEW_MARKER_SIZE / 2, NEW_MARKER_SIZE / 2]
    });
  } catch (error) {
    console.error('Error resizing image, using original for:', imageUrl, error);
    return L.divIcon({
      html: `
        <div class="marker-wrapper">
          <img class="outline-2 outline-offset-2 outline-pink-500 rounded-lg w-${NEW_MARKER_SIZE/4} h-${NEW_MARKER_SIZE/4} object-cover shadow-lg" src="${imageUrl}" alt="location (fallback)" />
        </div>
      `,
      className: 'custom-photo-pin',
      iconSize: [NEW_MARKER_SIZE, NEW_MARKER_SIZE],
      iconAnchor: [NEW_MARKER_SIZE / 2, NEW_MARKER_SIZE / 2]
    });
  }
};

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

  for (const place of places) {
    const icon = await createPinIcon(place.image);
    const marker = L.marker(place.coordinates, { icon });

    marker.on('add', function () {
      const markerElement = this.getElement();
      if (markerElement) {
        const markerWrapper = markerElement.querySelector('.marker-wrapper');
        if (markerWrapper) {
          // Add a random delay between 0 and 1 second
          const delay = Math.random() * 1000;
          markerWrapper.style.transitionDelay = `${delay}ms`;
          markerWrapper.style.animationDelay = `${delay}ms`;
          
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                markerWrapper.classList.add('marker-visible');
                observer.unobserve(markerWrapper);
                // Reset the delay after animation
                setTimeout(() => {
                  markerWrapper.style.transitionDelay = '0s';
                  markerWrapper.style.animationDelay = '0s';
                }, delay + 800);
              }
            },
            { threshold: 0.3 }
          );
          observer.observe(markerWrapper);
        } else {
          console.error('Marker wrapper (.marker-wrapper) not found in icon HTML for place:', place.name);
        }
      } else {
        console.error('Marker element (icon) not found after being added to map for place:', place.name);
      }
    });

    marker.addTo(map).on('click', () => openModal(place));
  }

  return map;
};

onMounted(async () => {
  vietnamMap = await initializeMap('vietnamMap', regions.southVietnam, vietnamPlaces);
  usMap = await initializeMap('usMap', regions.centralUSA, usPlaces);

  const mapSections = document.querySelectorAll('.map-container');
  const mapObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('map-visible');
        const mapInstance = entry.target.id === 'vietnamMapContainer' ? vietnamMap : usMap;
        if (mapInstance) {
          mapInstance.invalidateSize();
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  mapSections.forEach(section => mapObserver.observe(section));

  window.addEventListener('resize', () => {
    if (vietnamMap) vietnamMap.invalidateSize();
    if (usMap) usMap.invalidateSize();
  });
});
</script>

<template>
  <div data-section class="min-h-screen bg-pink-50 py-16 opacity-0 transform translate-y-10 transition-all duration-700 ease-out">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-5xl font-bold text-pink-600 mb-4 hover:text-pink-500 transition-colors duration-300">🌍 Places We've Been 🌍</h2>
        <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          From the bustling streets of Saigon to the quiet corners of America, our adventures have taken us far and wide.
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-8 items-start">
        <!-- Vietnam Map Section -->
        <div id="vietnamMapContainer" class="map-container md:w-1/2 bg-white p-6 rounded-xl shadow-2xl transform transition-all duration-1000 ease-out hover:shadow-pink-200/50">
          <h3 class="text-3xl font-semibold text-pink-500 mb-6 text-center">Adventures in Vietnam 🇻🇳</h3>
          <div id="vietnamMap" class="h-96 md:h-[600px] rounded-lg shadow-inner"></div>
          <p class="text-center text-gray-500 mt-4 text-sm">
            Exploring the vibrant culture and beautiful landscapes of Vietnam.
          </p>
        </div>

        <!-- US Map Section -->
        <div id="usMapContainer" class="map-container md:w-1/2 bg-white p-6 rounded-xl shadow-2xl transform transition-all duration-1000 ease-out hover:shadow-blue-200/50">
          <h3 class="text-3xl font-semibold text-blue-500 mb-6 text-center">Journeys in the USA 🇺🇸</h3>
          <div id="usMap" class="h-96 md:h-[600px] rounded-lg shadow-inner"></div>
           <p class="text-center text-gray-500 mt-4 text-sm">
            Discovering new horizons and creating memories across the United States.
          </p>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <!-- Modal for displaying place details -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center fixed-modal"
      @click="closeModal"
    >
      <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl mx-auto px-4">
        <div class="relative flex items-center justify-center">
          <img 
            :src="modalContent.image" 
            class="w-full h-auto object-contain rounded-lg transform transition-all duration-300 ease-out"
            :class="showModal ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
            @click.stop
          >
           <div class="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
            <h3 class="text-2xl font-bold">{{ modalContent.name }}</h3>
          </div>
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

.custom-photo-pin img {
  border-radius: 0.5rem;
  object-fit: cover;
  transform-origin: bottom center;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.custom-photo-pin:hover img {
  transform: scale(1.15) translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.marker-wrapper {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, opacity;
}

.marker-wrapper.marker-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: marker-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes marker-bounce {
  0% {
    transform: translateY(40px) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateY(-15px) scale(1.1);
    opacity: 0.8;
  }
  75% {
    transform: translateY(5px) scale(0.95);
    opacity: 0.9;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.map-container {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
  transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.map-container.map-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Modal animation */
@keyframes modal-enter {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-content-enter {
  animation: modal-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Add a subtle glow to map containers when visible */
.map-container.map-visible {
  box-shadow: 0 0 30px -5px rgba(236, 72, 153, 0.3); /* Soft pink glow */
}

#usMapContainer.map-visible {
   box-shadow: 0 0 30px -5px rgba(59, 130, 246, 0.3); /* Soft blue glow for US map */
}

/* Ensure Leaflet controls are styled consistently */
.leaflet-bar a, .leaflet-bar a:hover {
  background-color: white !important;
  color: #ec4899 !important; /* pink-500 */
  border-color: #fbcfe8 !important; /* pink-200 */
}

.leaflet-bar a.leaflet-disabled {
  background-color: #fce7f3 !important; /* pink-100 */
  color: #fda4af !important; /* pink-300 */
}

/* Ensure modal covers entire viewport */
.fixed-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* Use vw for full viewport width */
  height: 100vh; /* Use vh for full viewport height */
  z-index: 9999; /* High z-index */
  /* backdrop-filter: blur(4px); /* Optional: if you want blur like Love.vue */
}

/* Prevent body scroll when modal is open */
body.modal-open {
  overflow: hidden;
}
</style>