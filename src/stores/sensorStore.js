import { defineStore } from 'pinia'

export const useSensorStore = defineStore('sensor', {
  state: () => ({
    selectedType: 'temperature',
    selectedZone: 'A1',
    selectedView: 'sensor',
    zones: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'], // 
    lstUpdate: null,
    isSidebarOpen: true
  }),
  actions: {
    setView(viewType) {
      this.selectedView = viewType
    },
    setSelection(type, zone) {
      this.selectedType = type
      this.selectedZone = zone
      this.lastUpdate = new Date().toISOString()
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
})