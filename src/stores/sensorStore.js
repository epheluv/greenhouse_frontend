import { defineStore } from 'pinia'

export const useSensorStore = defineStore('sensor', {
  state: () => ({
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