<template>
    <v-simple-table class="my-4">
      <thead>
        <tr>
          <th class="text-left">Detalhe</th>
          <th class="text-left">Informação</th>
        </tr>
      </thead>
      <tbody>
        <!-- Dados do Equipamento -->
        <tr>
          <td>Estado Atual:</td>
          <td :style="{ color: selectedEquipement.lastState.color }">
            {{ selectedEquipement.lastState.name }}
          </td>
        </tr>
        <tr>
          <td>Receita Atual:</td>
          <td>R$ {{ selectedEquipement.earning.toFixed(2).replace('.', ',') }}</td>
        </tr>
        <tr>
          <td>Posições:</td>
          <td>{{ selectedEquipement.positions.length }}</td>
        </tr>
        <tr>
          <td>Estados:</td>
          <td>{{ selectedEquipement.states.length }}</td>
        </tr>
  
        <!-- Dados do Modelo -->
        <tr>
          <td>Modelo:</td>
          <td>{{ selectedEquipement.model.name }}</td>
        </tr>
        <tr v-for="hourlyEarning in selectedEquipement.model.hourlyEarnings" :key="hourlyEarning.id">
          <td>{{ hourlyEarning.name }}/H</td>
          <td>R$ {{ hourlyEarning.value.toFixed(2).replace('.', ',') }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </template>
  
  <script setup lang="ts">
  import { defineProps, watch } from 'vue'
  
  // Define os tipos para os dados do equipamento
  interface State {
    color: string
    name: string
  }
  
  interface HourlyEarning {
    id: string
    name: string
    value: number
  }
  
  interface Model {
    name: string
    hourlyEarnings: HourlyEarning[]
  }
  
  interface Position {
    date: Date
    lat: number
    lon: number
  }
  
  interface Equipment {
    lastState: State
    earning: number
    positions: Position[]
    states: State[]
    model: Model
  }
  
  // Props recebidas pelo componente
  const props = defineProps<{
    selectedEquipement: Equipment
  }>()
  
  // Acessa as props
  const { selectedEquipement } = props
  
  </script>
  