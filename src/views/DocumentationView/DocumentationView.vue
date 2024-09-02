<template>
  <v-container>
    <div class="documentation">
      <h1>Documentação do MapService</h1>

      <h2>Visão Geral</h2>
      <p>
        <code>MapService</code> é um serviço para manipulação de mapas utilizando a biblioteca
        Leaflet. Este serviço é responsável por:
      </p>
      <ul>
        <li>Inicializar o mapa.</li>
        <li>Adicionar marcadores de equipamentos.</li>
        <li>Configurar a visão do mapa.</li>
        <li>Ajustar a área visível para conter todos os equipamentos.</li>
        <li>Lidar com eventos de clique nos marcadores.</li>
      </ul>

      <h2>Estrutura do Módulo</h2>

      <h3>Importações</h3>
      <ul>
        <li>
          <code>CARRO_OPERANDO</code>: Ícone SVG usado para representar equipamentos operando no
          mapa.
        </li>
        <li>
          <code>IParsedEquipment</code>: Interface TypeScript que define a estrutura dos dados dos
          equipamentos.
        </li>
        <li><code>L</code>: Biblioteca Leaflet.</li>
      </ul>

      <h3>Constantes</h3>
      <ul>
        <li>
          <code>OMS_LAYER</code>: Camada de tiles para o OpenStreetMap, com um nível máximo de zoom
          de 19.
        </li>
        <li>
          <code>ICON_CLASS_MAP</code>: Um mapa de IDs de estado de equipamentos para nomes de
          classes CSS correspondentes.
        </li>
      </ul>

      <h3>Funções</h3>
      <ul>
        <li>
          <code>iconFactory(stateId: string)</code>: Cria um <code>divIcon</code> do Leaflet para um
          dado ID de estado do equipamento.
        </li>
      </ul>

      <h3>Classe MapService</h3>

      <h4>Propriedades</h4>
      <ul>
        <li>
          <code>map: L.Map | null</code>: Mantém a referência para a instância do mapa do Leaflet.
        </li>
        <li>
          <code>layerEquipments: L.FeatureGroup</code>: Grupo de features do Leaflet para gerenciar
          os marcadores dos equipamentos.
        </li>
        <li>
          <code>markerEquipments: L.Marker[]</code>: Array que armazena os marcadores dos
          equipamentos.
        </li>
        <li>
          <code>equipments: IParsedEquipment[]</code>: Array que armazena os dados dos equipamentos.
        </li>
        <li>
          <code>onEquipmentClickListener: Function | null</code>: Função de callback para lidar com
          cliques nos marcadores dos equipamentos.
        </li>
      </ul>

      <h4>Métodos</h4>
      <ul>
        <li>
          <code>constructor()</code>: Inicializa a instância da classe, criando um novo
          <code>FeatureGroup</code>.
        </li>
        <li><code>isInitialized(): boolean</code>: Verifica se o mapa foi inicializado.</li>
        <li>
          <code>init(elementId: string)</code>: Inicializa o mapa e adiciona as camadas necessárias.
        </li>
        <li>
          <code>setView(lat: number, lng: number, zoom = 13)</code>: Define a visão do mapa para uma
          latitude, longitude e nível de zoom específicos.
        </li>
        <li>
          <code>fitBounds(positions: [number, number][])</code>: Ajusta a área visível do mapa para
          conter todas as posições especificadas.
        </li>
        <li>
          <code>addEquipment(equipment: IParsedEquipment)</code>: Adiciona um equipamento ao mapa
          como um marcador.
        </li>
        <li>
          <code>onEquipmentClick(callback: Function)</code>: Define a função de callback a ser
          chamada quando um marcador de equipamento for clicado.
        </li>
        <li>
          <code>setEquipments(equipments: IParsedEquipment[])</code>: Define os equipamentos e
          atualiza os marcadores no mapa.
        </li>
        <li><code>destroy()</code>: Remove o mapa e libera recursos.</li>
      </ul>

      <h3>Exemplo de Uso</h3>
      <pre><code>import { mapService } from '@/services/MapService'

mapService.init('mapElementId')
mapService.setView(-23.55052, -46.633308)
mapService.setEquipments(equipmentList)
mapService.onEquipmentClick((equipment) => {
})</code></pre>
    </div>
  </v-container>
</template>

<style lang="css" scoped>
h1,
h2,
h3 {
  color: #333;
}
code {
  background-color: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
}
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
