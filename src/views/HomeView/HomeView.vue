<template>
  <v-container>
    <v-row class="flex-lg-row flex-column">
      <v-col>

            <div class="mb-4 pb-4 px-2">
              <h2 class="title">Filtros</h2>      
                  <div class="select">
                    <v-select
                      v-model="selectedModel"
                      label="Modelos"
                      :items="modelsWithAllOption"
                      variant="solo"
                      item-title="name"
                      item-value="id"
                    ></v-select>
                  </div>            
            </div>
            <div v-if="selectedEquipement" class="px-2">
              <h2 class="title">ID: {{ selectedEquipement.name }}</h2>
              <v-data-table :items-per-page="-1" hide-default-footer class="my-4">
                <template v-slot:header>
                  <tr>
                    <th class="text-left">Detalhe</th>
                    <th class="text-left">Informação</th>
                  </tr>
                </template>
                <template v-slot:body>
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
                  <tr>
                    <td>Modelo:</td>
                    <td>{{ selectedEquipement.model.name }}</td>
                  </tr>
                  <tr
                    v-for="hourlyEarning in selectedEquipement.model.hourlyEarnings"
                    :key="hourlyEarning.id"
                  >
                    <td>{{ hourlyEarning.name }}/H</td>
                    <td>R$ {{ hourlyEarning.value.toFixed(2).replace('.', ',') }}</td>
                  </tr>
                </template>
              </v-data-table>
            </div>
            <div v-else>Selecione um equipamento no mapa -></div>
        
     
      </v-col>
      <v-col> <div id="home-map"></div></v-col>
    </v-row>
    <v-dialog v-model="isModalOpen" max-width="800px">
      <v-card v-if="selectedEquipement" class="pa-4" max-height="80vh">
        <v-card-title class="d-flex align-center">
          {{ selectedEquipement.name }}
          <v-spacer></v-spacer>
          <v-btn icon @click="closeModal" class="position-absolute top-0 right-0 mt-1 mr-1">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <TableHistory :headers="tableHeaders" :items="selectedEquipement.states" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import TableHistory from './Partials/TableHistory/TableHistory.vue'
/* import TableDetail from './Partials/TableDetail/TableDetail.vue' */
import { onMounted, onUnmounted, ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { equipmentService } from '@/services/EquipmentService'
import { mapService } from '@/services/MapService'
import { stateService, type IState } from '@/services/StateService'
import { modelService, type IHourlyEarning } from '@/services/ModelService'
import type {
  IParsedEquipment,
  IParsedEquipmentPosition,
  IParsedEquipmentState,
  IParsedHourlyEarning,
  IParsedModel
} from '@/entities/entities'

const HOUR_IN_MS = 1000 * 60 * 60
const equipments = ref<IParsedEquipment[]>([])
const states = ref<IState[]>([])
const models = ref<IParsedModel[]>([])
// Definição da interface para os cabeçalhos da tabela
interface TableHeader {
  title: string
  value: string
}

// Colocando os headers dentro de um `ref` para torná-los reativos
const tableHeaders = ref<TableHeader[]>([
  { title: 'Data e Hora', value: 'date' },
  { title: 'Situação', value: 'color' },
  { title: 'Horas', value: 'hours' },
  { title: 'Receita', value: 'earning' }
])

const modelsWithAllOption = computed(() => {
  return [{ id: '0', name: 'Todos', hourlyEarnings: [] }, ...models.value]
})

const selectedModel = ref<string>('0')
const selectedEquipement = ref<IParsedEquipment | null>(null)
const isModalOpen = ref(false)
const equipmentModal = ref<HTMLElement | null>(null)
const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
const filteredEquipments = computed<IParsedEquipment[]>(() => {
  return equipments.value.filter((equipement) => {
    let shouldReturn = true
    if (selectedModel.value !== '0' && equipement.model.id !== selectedModel.value) {
      shouldReturn = false
    }

    return shouldReturn
  })
})

watch(filteredEquipments, (newEquipements) => {
  if (mapService.isInitialized()) {
    mapService.setEquipements(newEquipements)
    const newPositions = getLastPositions(newEquipements)
    mapService.fitBounds(newPositions)
  }
})

function findModelById(id: string): IParsedModel {
  const model = models.value.find((row) => row.id === id)
  if (!model) {
    throw Error(`Model(${id}) Not Found`)
  }

  return model
}

function findStateById(id: string): IState {
  const state = states.value.find((row) => row.id === id)
  if (!state) {
    throw Error(`State(${id}) Not Found`)
  }

  return state
}

function findAndParseEquipements() {
  const unparsedEquipements = equipmentService.findAll()

  const parsedEquipements = unparsedEquipements.map<IParsedEquipment>((equipement) => {
    const model = findModelById(equipement.equipmentModelId)

    const getHourlyEarning = (stateId: string): number => {
      const hourlyEarning = model.hourlyEarnings.find(
        (hourlyEarning) => hourlyEarning.id === stateId
      ) as IParsedHourlyEarning
      return hourlyEarning.value
    }

    const unparsedStates = equipmentService.findStatesById(equipement.id)
    const parsedStates = unparsedStates.map((equipmentState) => {
      const state = findStateById(equipmentState.equipmentStateId)
      const hourlyEarning = getHourlyEarning(equipmentState.equipmentStateId)

      const date = new Date(equipmentState.date)

      return {
        ...state,
        date,
        hourlyEarning: hourlyEarning
      }
    })
    const orderedStates = parsedStates.sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    })

    const populatedStates = orderedStates.map<IParsedEquipmentState>((equipmentState, index) => {
      let earning = 0
      let currentHours = 0
      if (index > 0) {
        const nextEquipmentState = orderedStates[index - 1]
        const nextDate = nextEquipmentState.date

        const diff = nextDate.getTime() - equipmentState.date.getTime()
        const hours = Math.floor(diff / HOUR_IN_MS)
        currentHours = hours
        earning = equipmentState.hourlyEarning * hours
      }
      return {
        ...equipmentState,
        earning,
        hours: currentHours
      }
    })

    const unparsedPositions = equipmentService.findPositionsById(equipement.id)
    const parsedPositions = unparsedPositions.map<IParsedEquipmentPosition>((position) => {
      return {
        ...position,
        date: new Date(position.date)
      }
    })
    const orderedPositions = parsedPositions.sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    })

    const lastState = populatedStates[0]
    const lastPosition = orderedPositions[0]

    const totalEarning = populatedStates.reduce<number>((acc, current) => {
      acc += current.earning
      return acc
    }, 0)

    const parsedEquipment: IParsedEquipment = {
      ...equipement,
      model,
      positions: orderedPositions,
      lastPosition: lastPosition,
      states: populatedStates,
      lastState: lastState,
      earning: totalEarning
    }
    return parsedEquipment
  })

  equipments.value = parsedEquipements
}

function getLastPositions(equipementList: IParsedEquipment[]): [number, number][] {
  return equipementList.map((equipment) => {
    return [equipment.lastPosition.lat, equipment.lastPosition.lon]
  })
}

function findAndParseModels() {
  const unparsedModels = modelService.findAll()

  const parsedModels = unparsedModels.map<IParsedModel>((unparsedModel) => {
    const parsedHourlyEarnings = unparsedModel.hourlyEarnings.map<IParsedHourlyEarning>(
      (parsedHourlyEarning) => {
        const state = findStateById(parsedHourlyEarning.equipmentStateId)
        return {
          id: parsedHourlyEarning.equipmentStateId,
          value: parsedHourlyEarning.value,
          name: state.name
        }
      }
    )

    return {
      id: unparsedModel.id,
      name: unparsedModel.name,
      hourlyEarnings: parsedHourlyEarnings
    }
  })

  models.value = parsedModels
}

onBeforeMount(() => {

  states.value = stateService.findAll()
  findAndParseModels()
  findAndParseEquipements()
})

onMounted(() => {

  const lastPositions = getLastPositions(equipments.value)
  mapService.init('home-map')
  mapService.fitBounds(lastPositions)
  mapService.setEquipements(equipments.value)
  mapService.onEquipmentClick((equipementClicked: IParsedEquipment) => {
    selectedEquipement.value = equipementClicked
    openModal()
  })
})

onUnmounted(() => {
  mapService.destroy()
})
</script>

<style lang="css">
#home-map {
  height: 600px;
}
.modal.is-active {
  z-index: 1000;
}
.side-section {
  border-bottom: 1px solid #bdc3c7;
}
.marker-equipment-icon {
}
.marker-equipment-icon.operando {
  fill: #2ecc71;
}
.marker-equipment-icon.parado {
  fill: #f1c40f;
}
.marker-equipment-icon.manutencao {
  fill: #e74c3c;
}
.marker-equipment-icon.selected {
  border: 2px solid #ff0000; /* Exemplo de borda para o marcador selecionado */
  background-color: #ffff00; /* Cor de fundo para o marcador selecionado */
}
</style>
