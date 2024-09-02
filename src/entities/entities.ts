export interface IParsedEquipmentState {
    id: string
    name: string
    color: string
    date: Date
    hourlyEarning: number
    earning: number
    hours: number
}

export interface IParsedEquipmentPosition {
    date: Date
    lat: number
    lon: number
}

export interface IParsedHourlyEarning {
    id: string
    name: string
    value: number
}

export interface IParsedModel {
    id: string
    name: string
    hourlyEarnings: IParsedHourlyEarning[]
}

export interface IParsedEquipment {
    id: string
    name: string
    model: IParsedModel
    positions: IParsedEquipmentPosition[]
    states: IParsedEquipmentState[]
    lastPosition: IParsedEquipmentPosition
    lastState: IParsedEquipmentState
    earning: number
}
