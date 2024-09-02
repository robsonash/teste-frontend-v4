<template>
  <v-data-table
    :headers="tableHeaders"
    :items="items"
    class="elevation-1"
    :items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:[`item.date`]="{ item }">
      {{ formatDate(item.date) }}
    </template>
    <template v-slot:[`item.name`]="{ item }">
      <span :style="{ color: item.color }">{{ item.name }}</span>
    </template>
    <template v-slot:[`item.color`]="{ item }">
      <span :style="{ color: item.color }">{{ item.name }}</span>
    </template>
    <template v-slot:[`item.earning`]="{ item }"> R$ {{ formatCurrency(item.earning) }} </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

// Definindo as props esperadas pelo componente
interface TableHeader {
  title: string
  value: string
}

interface EquipmentState {
  date: string | Date
  name: string
  color: string
  earning: number
}

// Props do componente
const props = defineProps<{
  headers: TableHeader[]
  items: EquipmentState[]
}>()

// Funções utilitárias
const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

const formatCurrency = (amount: number): string => {
  return amount.toFixed(2).replace('.', ',')
}

// Computed properties para os headers e items
const tableHeaders = computed(() => props.headers)
const items = computed(() => props.items)
</script>

<style scoped>
/* Adicione estilos personalizados se necessário */
</style>
