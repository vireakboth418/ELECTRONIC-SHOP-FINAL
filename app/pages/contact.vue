<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  topic: 'General question',
  message: '',
})

const topics = ['General question', 'Repair status', 'Warranty claim', 'Bulk / business order']

const submitted = ref(false)
const sending = ref(false)

const messageLimit = 500
const remaining = () => messageLimit - form.message.length

const handleSubmit = () => {
  if (!form.name || !form.email || !form.message) return
  sending.value = true
  // Simulated send — wire this up to your real endpoint.
  setTimeout(() => {
    sending.value = false
    submitted.value = true
  }, 900)
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.topic = 'General question'
  form.message = ''
  submitted.value = false
}

const channels = [
  { label: 'Call the shop', value: '+92 42 111 234 567', hours: 'Mon\u2013Sat, 10am\u20138pm' },
  { label: 'WhatsApp', value: '+92 300 1234567', hours: 'Usually replies within the hour' },
  { label: 'Email', value: 'hello@voltraelectronics.pk', hours: 'Reply within one business day' },
]

const stores = [
  { city: 'Lahore \u2014 Gulberg', address: 'Plot 14, Main Boulevard', hours: '10am \u2013 9pm, daily' },
  { city: 'Lahore \u2014 DHA', address: 'Y Block Market, Phase 3', hours: '11am \u2013 9pm, daily' },
  { city: 'Karachi \u2014 Clifton', address: 'Block 5, Khayaban-e-Roomi', hours: '11am \u2013 10pm, daily' },
  { city: 'Islamabad \u2014 F-7', address: 'Jinnah Super Market', hours: '10am \u2013 9pm, daily' },
]

const faqs = [
  {
    q: 'How long does a screen repair take?',
    a: 'Most phone screens are done in under an hour while you wait. Laptops and less common models can take 1\u20132 days if we need to order the part.',
  },
  {
    q: 'Do you price-match other stores?',
    a: 'Yes, on identical new-and-sealed items from another authorised dealer. Bring or send us the listing and we\u2019ll match it.',
  },
  {
    q: 'Can I return something if I just don\u2019t like it?',
    a: 'Unopened items can be returned within 7 days. Opened items are covered by the manufacturer warranty rather than a change-of-mind return.',
  },
  {
    q: 'Do you buy back old devices?',
    a: 'Yes \u2014 bring the device to any store for a free valuation. Trade-in value can be applied straight to a new purchase.',
  },
]

const openFaq = ref<number | null>(0)
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const activeStore = ref(0)
const mapUrl = computed(() => {
  const store = stores[activeStore.value]
  const query = encodeURIComponent(`${store.city.replace(' \u2014 ', ', ')}, ${store.address}, Pakistan`)
  return `https://maps.google.com/maps?q=${query}&z=15&output=embed`
})
</script>

<template>
  <div class="bg-[#F2F3F5] font-['IBM_Plex_Sans',sans-serif] text-[#101828]">

    <!-- ================= HERO ================= -->
    <section class="border-b border-[#D7DAE0]">
      <div class="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p class="text-sm text-[#475467]">Get in touch</p>
        <h1 class="mt-4 max-w-2xl font-['Space_Grotesk',sans-serif] text-4xl font-medium leading-[1.1] md:text-5xl">
          A real person answers. Usually within the hour.
        </h1>
        <p class="mt-6 max-w-md text-base leading-relaxed text-[#475467]">
          Question about an order, a repair, or just want to know if we stock something? Pick whichever
          feels easiest.
        </p>

        <div class="mt-10 grid grid-cols-1 gap-6 border-t border-[#D7DAE0] pt-8 sm:grid-cols-3">
          <div v-for="channel in channels" :key="channel.label">
            <p class="text-xs text-[#475467]">{{ channel.label }}</p>
            <p class="mt-1 font-['Space_Grotesk',sans-serif] text-lg">{{ channel.value }}</p>
            <p class="mt-1 text-xs text-[#8A93A6]">{{ channel.hours }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= FORM + STORES ================= -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid grid-cols-1 gap-16 md:grid-cols-[1fr_0.8fr]">

        <!-- Form -->
        <div>
          <h2 class="font-['Space_Grotesk',sans-serif] text-2xl font-medium">Send a message</h2>

          <Transition name="swap" mode="out-in">
            <div
              v-if="submitted"
              key="done"
              class="mt-8 rounded-sm border border-[#B98B2A] bg-white p-8"
            >
              <p class="font-['Space_Grotesk',sans-serif] text-xl">Message sent.</p>
              <p class="mt-2 text-sm leading-relaxed text-[#475467]">
                Thanks, {{ form.name.split(' ')[0] || 'friend' }} — we'll reply at {{ form.email }} soon.
              </p>
              <button
                type="button"
                @click="resetForm"
                class="mt-6 cursor-pointer rounded-sm border border-[#101828] px-5 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-[#F2F3F5]"
              >
                Send another message
              </button>
            </div>

            <form v-else key="form" class="mt-8 space-y-5" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label class="text-xs text-[#475467]">Your name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Ahmed Raza"
                    class="mt-1.5 w-full rounded-sm border border-[#D7DAE0] bg-white px-4 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-[#B98B2A]"
                  />
                </div>
                <div>
                  <label class="text-xs text-[#475467]">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    class="mt-1.5 w-full rounded-sm border border-[#D7DAE0] bg-white px-4 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-[#B98B2A]"
                  />
                </div>
              </div>

              <div>
                <label class="text-xs text-[#475467]">What's this about</label>
                <div class="mt-1.5 flex flex-wrap gap-2">
                  <button
                    v-for="topic in topics"
                    :key="topic"
                    type="button"
                    @click="form.topic = topic"
                    :class="form.topic === topic ? 'bg-[#101828] text-white' : 'bg-white text-[#475467] hover:bg-[#EDEFF2]'"
                    class="cursor-pointer rounded-sm border border-[#D7DAE0] px-3.5 py-1.5 text-xs font-medium transition-colors duration-200"
                  >
                    {{ topic }}
                  </button>
                </div>
              </div>

              <div>
                <div class="flex items-baseline justify-between">
                  <label class="text-xs text-[#475467]">Message</label>
                  <span class="text-xs text-[#8A93A6]">{{ remaining() }} characters left</span>
                </div>
                <textarea
                  v-model="form.message"
                  :maxlength="messageLimit"
                  required
                  rows="5"
                  placeholder="Tell us what's going on..."
                  class="mt-1.5 w-full resize-none rounded-sm border border-[#D7DAE0] bg-white px-4 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-[#B98B2A]"
                />
              </div>

              <button
                type="submit"
                :disabled="sending"
                class="cursor-pointer rounded-sm bg-[#101828] px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1D2939] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ sending ? 'Sending…' : 'Send message' }}
              </button>
            </form>
          </Transition>
        </div>

        <!-- Stores -->
        <div>
          <h2 class="font-['Space_Grotesk',sans-serif] text-2xl font-medium">Or visit a store</h2>
          <div class="mt-8 divide-y divide-[#D7DAE0] border-t border-[#D7DAE0]">
            <button
              v-for="(store, index) in stores"
              :key="store.city"
              type="button"
              @click="activeStore = index"
              class="flex w-full cursor-pointer flex-col items-start gap-1 py-5 text-left transition-colors duration-150"
            >
              <p class="flex items-center gap-2 font-medium">
                <span
                  class="h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-150"
                  :class="activeStore === index ? 'bg-[#B98B2A]' : 'bg-[#D7DAE0]'"
                />
                {{ store.city }}
              </p>
              <p class="pl-3.5 text-sm text-[#475467]">{{ store.address }}</p>
              <p class="pl-3.5 text-xs text-[#8A93A6]">{{ store.hours }}</p>
            </button>
          </div>
        </div>

      </div>
    </section>

    <!-- ================= MAP ================= -->
    <section class="border-t border-[#D7DAE0] bg-white">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <h2 class="font-['Space_Grotesk',sans-serif] text-2xl font-medium">Find us on the map</h2>
          <p class="text-sm text-[#475467]">
            Showing <span class="text-[#101828]">{{ stores[activeStore].city }}</span> — pick a store above to change it
          </p>
        </div>

        <div class="mt-8 overflow-hidden rounded-sm border border-[#D7DAE0]">
          <iframe
            :key="activeStore"
            :src="mapUrl"
            class="h-[420px] w-full grayscale-[15%]"
            style="border: 0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :title="`Map showing ${stores[activeStore].city}`"
          />
        </div>
      </div>
    </section>

    <!-- ================= FAQ ================= -->
    <section class="border-t border-[#D7DAE0] bg-white">
      <div class="mx-auto max-w-3xl px-6 py-20">
        <h2 class="font-['Space_Grotesk',sans-serif] text-2xl font-medium">Before you write in</h2>

        <div class="mt-8 divide-y divide-[#D7DAE0] border-t border-b border-[#D7DAE0]">
          <div v-for="(item, index) in faqs" :key="item.q">
            <button
              type="button"
              @click="toggleFaq(index)"
              class="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
            >
              <span class="font-medium">{{ item.q }}</span>
              <span
                class="shrink-0 text-lg text-[#B98B2A] transition-transform duration-200"
                :class="openFaq === index ? 'rotate-45' : 'rotate-0'"
              >
                +
              </span>
            </button>
            <div
              class="grid overflow-hidden transition-all duration-300 ease-out"
              :class="openFaq === index ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'"
            >
              <p class="min-h-0 max-w-xl text-sm leading-relaxed text-[#475467]">{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.2s ease;
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}
</style>