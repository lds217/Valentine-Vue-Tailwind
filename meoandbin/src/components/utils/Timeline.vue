<!-- Timeline.vue -->
<template>
  <section data-section class="h-screen flex flex-col items-center justify-center p-6 bg-pink-200 relative overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center opacity-20 bg-no-repeat z-0" 
         style="background-image: url('src/assets/img/3.jpg'); transform: translate3d(0, 0, 0);">
    </div>
    
    <!-- Container to limit width and center content -->
    <div class="relative w-full max-w-3xl mx-auto z-10">
      <!-- Title Section -->
      <div>
        <h2 class="text-3xl font-bold text-pink-500 text-center">💖 When we meet! 💖</h2>
        <p class="text-center text-gray-600 mt-2">Distance can't stop us! 💌</p>
      </div>
      
      <!-- Main Content: Compressed but maintained structure -->
      <div class="mt-6">
        <!-- Calendar with fixed height -->
        <div id="github-calendar" class="calendar h-96"></div>
        
        <!-- Summary Section -->
        <div class="border-t border-pink-200 mt-2 pt-4 grid grid-cols-2 gap-4">
          <div class="text-center">
            <p class="text-gray-500 text-sm">Total Days</p>
            <p class="text-xl font-bold text-pink-500">94</p>
          </div>
          <div class="text-center">
            <p class="text-gray-500 text-sm">Longest Together</p>
            <p class="text-xl font-bold text-pink-500">28 days</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import GitHubCalendar from 'github-calendar';
import 'github-calendar/dist/github-calendar.css';

export default {
  name: 'Timeline',
  mounted() {
    GitHubCalendar("#github-calendar", "meoandbin", {
      responsive: true,
      tooltips: false,
      global_stats: false,
      cache: 43200, // 12 hours cache
      summary_text: '💕 Our moments together in commits 💕'
    });
  }
}
</script>

<style>
/* Base calendar styles */
:root {
  --color-calendar-graph-day-bg: #fce7f3;
  --color-calendar-graph-day-L1-bg: #fbcfe8;
  --color-calendar-graph-day-L2-bg: #f9a8d4;
  --color-calendar-graph-day-L3-bg: #f472b6;
  --color-calendar-graph-day-L4-bg: #ec4899;
}

.calendar {
  font-family: Helvetica, arial;
  border: none !important;
  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Contribution squares styling */
.calendar :deep(.ContributionCalendar) {
  border: 0 !important;
  padding-bottom: 0 !important;
}

.calendar :deep(.ContributionCalendar-day) {
  border: 0 !important;
  border-radius: 3px !important;
  width: 11px !important;
  height: 11px !important;
}

/* Grid styling */
.calendar :deep(.ContributionCalendar-grid) {
  margin-bottom: 0 !important;
  border: none !important;
}

.calendar :deep(table) {
  border: none !important;
  border-spacing: 2px !important;
  border-collapse: separate !important;
  margin: auto !important;
}

.calendar :deep(td) {
  border: none !important;
  padding: 0 !important;
}

/* Level colors */
.ContributionCalendar-day[data-level='0'] {
  background-color: var(--color-calendar-graph-day-bg);
}

.ContributionCalendar-day[data-level='1'] {
  background-color: var(--color-calendar-graph-day-L1-bg);
}

.ContributionCalendar-day[data-level='2'] {
  background-color: var(--color-calendar-graph-day-L2-bg);
}

.ContributionCalendar-day[data-level='3'] {
  background-color: var(--color-calendar-graph-day-L3-bg);
}

.ContributionCalendar-day[data-level='4'] {
  background-color: var(--color-calendar-graph-day-L4-bg);
}

/* Text styling */
.calendar-graph text.wday,
.calendar-graph text.month {
  font-size: 10px;
  fill: #959da5;
}

text.ContributionCalendar-label {
  fill: #959da5;
  font-size: 11px;
}

/* Hide unnecessary elements */
.contrib-footer {
  display: none !important;
}

.calendar .width-full > .float-left {
  display: none;
}

#user-activity-overview {
  display: none;
}

h2.f4.text-normal.mb-3 {
  display: none;
}

tool-tip {
  display: none;
}

/* Legend styling */
.contrib-legend {
  text-align: right;
  padding: 0 14px 0 0 !important;
}

.contrib-legend .legend li {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin: 0 5px;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .table-column {
    display: block;
    width: 100%;
  }
}

/* Style for all contribution blocks */
.ContributionCalendar-day {
  border-radius: 3px !important;  /* Consistent rounded corners */
  width: 11px !important;         /* Maintain width */
  height: 11px !important;        /* Keep squares proportional */
  margin: 2px !important;         /* Add spacing between blocks */
}

/* If you need to target specific elements through their attributes */
td[data-view-component="true"].ContributionCalendar-day {
  border-radius: 3px !important;
}

/* To ensure spacing between cells */
table.ContributionCalendar-grid {
  border-spacing: 2px !important;
  border-collapse: separate !important;
}

.ContributionCalendar-day[data-date="2025-02-12"] {
    background-color: var(--color-calendar-graph-day-bg) !important;
    fill: var(--color-calendar-graph-day-bg) !important;
}
</style>