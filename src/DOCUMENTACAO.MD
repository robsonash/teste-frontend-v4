# Documentação do MapService

## Visão Geral

`MapService` é um serviço para manipulação de mapas utilizando a biblioteca Leaflet. Este serviço é responsável por:

- Inicializar o mapa.
- Adicionar marcadores de equipamentos.
- Configurar a visão do mapa.
- Ajustar a área visível para conter todos os equipamentos.
- Lidar com eventos de clique nos marcadores.

## Estrutura do Módulo

### Importações

- **`CARRO_OPERANDO`**: Ícone SVG usado para representar equipamentos operando no mapa.
- **`IParsedEquipment`**: Interface TypeScript que define a estrutura dos dados dos equipamentos.
- **`L`**: Biblioteca Leaflet.

### Constantes

- **`OMS_LAYER`**: Camada de tiles para o OpenStreetMap, com um nível máximo de zoom de 19.
- **`ICON_CLASS_MAP`**: Um mapa de IDs de estado de equipamentos para nomes de classes CSS correspondentes.

### Funções

- **`iconFactory(stateId: string)`**: Cria um `divIcon` do Leaflet para um dado ID de estado do equipamento.

### Classe MapService

#### Propriedades

- **`map: L.Map | null`**: Mantém a referência para a instância do mapa do Leaflet.
- **`layerEquipments: L.FeatureGroup`**: Grupo de features do Leaflet para gerenciar os marcadores dos equipamentos.
- **`markerEquipments: L.Marker[]`**: Array que armazena os marcadores dos equipamentos.
- **`equipments: IParsedEquipment[]`**: Array que armazena os dados dos equipamentos.
- **`onEquipmentClickListener: Function | null`**: Função de callback para lidar com cliques nos marcadores dos equipamentos.

#### Métodos

- **`constructor()`**: Inicializa a instância da classe, criando um novo `FeatureGroup`.
- **`isInitialized(): boolean`**: Verifica se o mapa foi inicializado.
- **`init(elementId: string)`**: Inicializa o mapa e adiciona as camadas necessárias.
- **`setView(lat: number, lng: number, zoom = 13)`**: Define a visão do mapa para uma latitude, longitude e nível de zoom específicos.
- **`fitBounds(positions: [number, number][])`**: Ajusta a área visível do mapa para conter todas as posições especificadas.
- **`addEquipment(equipment: IParsedEquipment)`**: Adiciona um equipamento ao mapa como um marcador.
- **`onEquipmentClick(callback: Function)`**: Define a função de callback a ser chamada quando um marcador de equipamento for clicado.
- **`setEquipments(equipments: IParsedEquipment[])`**: Define os equipamentos e atualiza os marcadores no mapa.
- **`destroy()`**: Remove o mapa e libera recursos.

## Exemplo de Uso

```javascript
import { mapService } from '@/services/MapService'

mapService.init('mapElementId')
mapService.setView(-23.55052, -46.633308)
mapService.setEquipments(equipmentList)
mapService.onEquipmentClick((equipment) => {
  selectedEquipement.value = equipementClicked
    openModal()
})
```
