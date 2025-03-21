<script setup>
import { RouterView } from 'vue-router'

import Header from '@/components/HeaderHeader.vue'
import Footer from './components/FooterFooter.vue'
</script>

<template>
  <Header />

  <RouterView />

  <Footer />
</template>

<style scoped></style>
