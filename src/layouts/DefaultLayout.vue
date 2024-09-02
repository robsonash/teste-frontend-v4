<template>
  <v-app>
    <Header />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
// Importação dos componentes que fazem parte do layout
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
</script>

<style scoped>
/* Estilos específicos para o layout, se necessário */
</style>
