<script setup lang="ts">
const milestones = [
  {
    year: '2015',
    title: 'Two rooms, one counter',
    text: 'Started as a single repair counter in Lahore, fixing phones other shops had given up on.',
  },
  {
    year: '2018',
    title: 'First full store',
    text: 'Opened our first proper showroom, stocking phones, laptops and audio from brands people actually trust.',
  },
  {
    year: '2021',
    title: 'Went online',
    text: 'Launched the online store so people outside the city could get the same prices and the same warranty.',
  },
  {
    year: 'Today',
    title: 'Four cities, one promise',
    text: 'Every item we sell is genuine, every price is the price, and every repair is done in front of you if you want to watch.',
  },
]

const values = [
  {
    title: 'We tell you not to buy things',
    text: 'If the cheaper model does what you need, our staff are trained to say so — even when the commission says otherwise.',
    size: 'wide',
  },
  {
    title: 'Nothing leaves the box twice',
    text: 'Every unit is checked and sealed in-store. What you unbox at home is exactly what left our shelf.',
    size: 'narrow',
  },
  {
    title: 'Repairs, not replacements',
    text: 'A cracked screen or a dead battery is a repair job first. We only suggest a new device when fixing costs more than it should.',
    size: 'narrow',
  },
]

const stats = [
  { value: '9', label: 'years trading' },
  { value: '4', label: 'stores across Pakistan' },
  { value: '60,000+', label: 'devices sold' },
  { value: '2 yr', label: 'average warranty honoured' },
]

const team = [
  { name: 'Hamza Iqbal', role: 'Founder', note: 'Still does Saturday shifts at the repair bench.' },
  { name: 'Sana Rafiq', role: 'Head of Service', note: 'Trains every technician before they touch a customer\u2019s device.' },
  { name: 'Bilal Ahmed', role: 'Store Operations', note: 'Keeps the shelves honest — no ghost stock, no fake urgency.' },
]
</script>

<template>
  <div class="bg-[#F2F3F5] font-['IBM_Plex_Sans',sans-serif] text-[#101828]">

    <!-- ================= HERO ================= -->
    <section class="relative overflow-hidden border-b border-[#D7DAE0]">
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">

        <div>
          <p class="text-sm text-[#475467]">Since 2015 &middot; Lahore, Pakistan</p>
          <h1 class="mt-4 font-['Space_Grotesk',sans-serif] text-4xl font-medium leading-[1.1] md:text-5xl">
            We sell electronics like the people buying them are smarter than the marketing.
          </h1>
          <p class="mt-6 max-w-md text-base leading-relaxed text-[#475467]">
            No countdown timers, no "only 2 left" tricks. Just real stock, honest prices,
            and a repair bench that outlasts most warranties.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              class="cursor-pointer rounded-sm bg-[#101828] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1D2939]"
            >
              Browse products
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-sm border border-[#101828] px-6 py-3 text-sm font-medium text-[#101828] transition-colors duration-200 hover:bg-white"
            >
              Find a store
            </button>
          </div>
        </div>

        <!-- Original circuit-line illustration, no external image dependency -->
        <div class="relative flex items-center justify-center">
          <svg viewBox="0 0 360 320" class="h-full w-full max-w-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="30" width="280" height="260" rx="14" fill="#FFFFFF" stroke="#D7DAE0" stroke-width="1.5" />
            <path d="M60 90 H150 V60" stroke="#B98B2A" stroke-width="2" />
            <circle cx="150" cy="60" r="5" fill="#B98B2A" />
            <path d="M60 130 H120" stroke="#101828" stroke-width="2" />
            <circle cx="120" cy="130" r="4" fill="#101828" />
            <path d="M240 60 V110 H300" stroke="#101828" stroke-width="2" />
            <circle cx="300" cy="110" r="4" fill="#101828" />
            <path d="M180 260 V210 H260 V180" stroke="#B98B2A" stroke-width="2" />
            <circle cx="260" cy="180" r="5" fill="#B98B2A" />
            <path d="M80 220 H160" stroke="#101828" stroke-width="2" />
            <circle cx="80" cy="220" r="4" fill="#101828" />
            <rect x="150" y="130" width="70" height="70" rx="8" fill="#101828" />
            <rect x="165" y="145" width="40" height="40" rx="4" fill="#B98B2A" />
          </svg>

          <div class="absolute -bottom-4 left-1/2 w-56 -translate-x-1/2 rounded-sm border border-[#D7DAE0] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(16,24,40,0.08)] md:left-6 md:translate-x-0">
            <p class="font-['Space_Grotesk',sans-serif] text-2xl">60,000+</p>
            <p class="text-xs text-[#475467]">devices repaired or sold, tracked by serial number</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ================= OUR STORY ================= -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <h2 class="font-['Space_Grotesk',sans-serif] text-2xl font-medium">How we got here</h2>

      <div class="mt-12 grid grid-cols-1 gap-10 md:grid-cols-4">
        <div
          v-for="(step, index) in milestones"
          :key="step.year"
          class="relative pl-6 md:border-t md:border-[#D7DAE0] md:pl-0 md:pt-6"
        >
          <span
            class="absolute left-0 top-1 h-2 w-2 -translate-x-[3px] rounded-full bg-[#B98B2A] md:-top-[5px] md:left-0 md:translate-x-0"
          />
          <p class="font-['Space_Grotesk',sans-serif] text-lg text-[#B98B2A]">{{ step.year }}</p>
          <p class="mt-1 font-medium">{{ step.title }}</p>
          <p class="mt-2 text-sm leading-relaxed text-[#475467]">{{ step.text }}</p>
        </div>
      </div>
    </section>

    <!-- ================= VALUES ================= -->
    <section class="border-y border-[#D7DAE0] bg-white">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <h2 class="font-['Space_Grotesk',sans-serif] text-2xl font-medium">What we won't compromise on</h2>

        <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            v-for="item in values"
            :key="item.title"
            :class="item.size === 'wide' ? 'md:col-span-2' : 'md:col-span-1'"
            class="rounded-sm border border-[#D7DAE0] p-8"
          >
            <p class="font-['Space_Grotesk',sans-serif] text-lg">{{ item.title }}</p>
            <p class="mt-3 text-sm leading-relaxed text-[#475467]">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= STATS BAND ================= -->
    <section class="bg-[#101828] text-white">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label">
          <p class="font-['Space_Grotesk',sans-serif] text-3xl text-[#B98B2A]">{{ stat.value }}</p>
          <p class="mt-2 text-sm text-[#CBD2DE]">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ================= TEAM ================= -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <h2 class="font-['Space_Grotesk',sans-serif] text-2xl font-medium">Who's actually behind the counter</h2>

      <div class="mt-10 divide-y divide-[#D7DAE0] border-t border-[#D7DAE0]">
        <div
          v-for="person in team"
          :key="person.name"
          class="flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p class="font-medium">{{ person.name }}</p>
            <p class="text-sm text-[#475467]">{{ person.role }}</p>
          </div>
          <p class="max-w-md text-sm text-[#475467]">{{ person.note }}</p>
        </div>
      </div>
    </section>

    <!-- ================= CTA ================= -->
    <section class="border-t border-[#D7DAE0] bg-white">
      <div class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
        <div>
          <p class="font-['Space_Grotesk',sans-serif] text-xl">Come hold it before you buy it.</p>
          <p class="mt-2 text-sm text-[#475467]">Four stores, real stock on the shelf, no appointment needed.</p>
        </div>
        <button
          type="button"
          class="cursor-pointer rounded-sm bg-[#101828] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1D2939]"
        >
          Find your nearest store
        </button>
      </div>
    </section>

  </div>
</template>