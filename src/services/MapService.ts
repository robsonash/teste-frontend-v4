import { CARRO_OPERANDO } from '@/assets/icons'
import type { IParsedEquipment } from '@/entities/entities'
import L from 'leaflet'

const OMS_LAYER = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

const ICON_CLASS_MAP: Record<string, string> = {
    '0808344c-454b-4c36-89e8-d7687e692d57': 'operando',
    'baff9783-84e8-4e01-874b-6fd743b875ad': 'parado',
    '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f': 'manutencao'
}

function iconFactory(stateId: string) {
    return L.divIcon({
        html: CARRO_OPERANDO,
        iconSize: [25, 25],
        iconAnchor: [12, 0],
        className: `marker-equipment-icon ${ICON_CLASS_MAP[stateId]}`
    })
}

class MapService {
    map: L.Map | null = null
    layerEquipments: L.FeatureGroup = new L.FeatureGroup()
    markerEquipments: L.Marker[] = []
    equipments: IParsedEquipment[] = []
    onEquipmentClickListener: Function | null = null

    constructor() {
        this.layerEquipments = new L.FeatureGroup()
    }

    isInitialized(): boolean {
        if (this.map) {
            return true
        }
        return false
    }

    init(elementId: string) {
        this.map = L.map(elementId)
        this.map.addLayer(OMS_LAYER)
        this.map.addLayer(this.layerEquipments)
    }

    setView(lat: number, lng: number, zoom = 13) {
        if (!this.map) {
            throw Error('Map not initialized')
        }
        this.map.setView([lat, lng], zoom)
    }

    fitBounds(positions: [number, number][]) {
        if (!this.map) {
            throw Error('Map not initialized')
        }
        this.map.fitBounds(positions)
    }

    addEquipment(equipment: IParsedEquipment) {
        const icon = iconFactory(equipment.lastState.id)
        const marker = L.marker([equipment.lastPosition.lat, equipment.lastPosition.lon], {
            icon: icon
        })

        marker.bindTooltip(`<span><b>${equipment.name}</b><br>${equipment.lastState.name}</span>`, {
            direction: 'top'
        })

        marker.on('click', () => {
            if (this.onEquipmentClickListener) {
                this.onEquipmentClickListener(equipment)
            }
        })

        this.layerEquipments.addLayer(marker)
        this.markerEquipments.push(marker)
    }

    onEquipmentClick(callback: Function) {
        this.onEquipmentClickListener = callback
    }

    setEquipements(equipements: IParsedEquipment[]) {
        if (!this.map) {
            throw Error('Map not initialized')
        }
        this.layerEquipments.clearLayers()
        this.markerEquipments = []
        this.equipments = equipements
        this.equipments.forEach((equipement) => this.addEquipment(equipement))
    }

    destroy() {
        if (this.map) {
            this.map.remove()
        }
    }
}

export const mapService = new MapService()
