import { defineStore } from 'pinia'

export const useSensorStore = defineStore('sensor', {
  state: () => ({
    selectedType: 'temperature',
    selectedZone: 'A1',
    zones: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'], // 
    lstUpdate: null
  }),
  actions: {
    setSelection(type, zone) {
      this.selectedType = type
      this.selectedZone = zone
      this.lastUpdate = new Date().toISOString()
    }
  }
})