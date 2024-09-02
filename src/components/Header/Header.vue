<template>
  <v-container>
    <v-navigation-drawer v-model="sidebar" app>
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path" link>
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="sidebar = !sidebar" />
      <v-toolbar-title>
        <router-link to="/" style="cursor: pointer">
          <v-img :src="logoSrc" max-width="100" max-height="100" class="mr-2"></v-img>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="d-none d-md-flex">
        <v-btn variant="text" v-for="item in menuItems" :key="item.title" :to="item.path">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from '@/assets/aiko.png'
// Defina a interface MenuItem
interface MenuItem {
  title: string
  path: string
  icon: string
}
const logoSrc = ref(logo)
const sidebar = ref(false)
const menuItems = ref<MenuItem[]>([
  { title: 'Página principal', path: '/', icon: 'mdi-home' },
  { title: 'Documentação', path: '/documentation', icon: 'mdi-text-box' }
])
</script>

<style scoped>
/* Estilos customizados aqui */
</style>
