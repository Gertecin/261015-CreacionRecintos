import { create } from 'zustand'

const TIPOS_PABELLON = {
  internacional: { color: '#e8a0a0', altura: 3 },
  nacional: { color: '#a0c8e8', altura: 2.5 },
  estandar: { color: '#a0d8a0', altura: 2 },
  maquinaria: { color: '#f0d8a0', altura: 2.5 },
  salon: { color: '#b0b0b0', altura: 1.5 },
}

export const useRecintoStore = create((set) => ({
  recintoActivo: 0,
  recintos: Array(5).fill(null).map((_, i) => ({
    id: i + 1,
    nombre: `Recinto ${i + 1}`,
    pabellones: [],
    espaciosAireLibre: [],
    distribucion: 'anillo',
    accesos: [],
    finalizado: false,
  })),
  setRecintoActivo: (index) => set({ recintoActivo: index }),
  setDistribucion: (dist) => set((state) => {
    const recintos = [...state.recintos]
    recintos[state.recintoActivo] = { ...recintos[state.recintoActivo], distribucion: dist }
    return { recintos }
  }),
  addPabellon: (data) => set((state) => {
    const recintos = [...state.recintos]
    const recinto = { ...recintos[state.recintoActivo] }
    if (recinto.pabellones.length >= 25) return state
    recinto.pabellones = [...recinto.pabellones, { 
      id: Date.now(), 
      m2: data.m2 || 100, 
      tipo: data.tipo || 'estandar',
      ...TIPOS_PABELLON[data.tipo || 'estandar']
    }]
    recintos[state.recintoActivo] = recinto
    return { recintos }
  }),
  deletePabellon: (pabellonId) => set((state) => {
    const recintos = [...state.recintos]
    const recinto = { ...recintos[state.recintoActivo] }
    recinto.pabellones = recinto.pabellones.filter(p => p.id !== pabellonId)
    recinto.accesos = recinto.accesos.filter(a => a !== pabellonId)
    recintos[state.recintoActivo] = recinto
    return { recintos }
  }),
  addEspacioAireLibre: (m2) => set((state) => {
    const recintos = [...state.recintos]
    const recinto = { ...recintos[state.recintoActivo] }
    if (recinto.espaciosAireLibre.length >= 3) return state
    recinto.espaciosAireLibre = [...recinto.espaciosAireLibre, { id: Date.now(), m2 }]
    recintos[state.recintoActivo] = recinto
    return { recintos }
  }),
  toggleAcceso: (pabellonId) => set((state) => {
    const recintos = [...state.recintos]
    const recinto = { ...recintos[state.recintoActivo] }
    const accesos = [...recinto.accesos]
    const idx = accesos.indexOf(pabellonId)
    if (idx >= 0) {
      accesos.splice(idx, 1)
    } else {
      if (accesos.length >= 2) return state
      accesos.push(pabellonId)
    }
    recinto.accesos = accesos
    recintos[state.recintoActivo] = recinto
    return { recintos }
  }),
  finalizarRecinto: () => set((state) => {
    const recintos = [...state.recintos]
    const recinto = { ...recintos[state.recintoActivo] }
    if (recinto.pabellones.length === 0) return state
    if (recinto.accesos.length !== 2) return state
    recinto.finalizado = true
    recintos[state.recintoActivo] = recinto
    return { recintos }
  }),
  resetRecinto: () => set((state) => {
    const recintos = [...state.recintos]
    recintos[state.recintoActivo] = { ...recintos[state.recintoActivo], pabellones: [], espaciosAireLibre: [], accesos: [], finalizado: false }
    return { recintos }
  }),
}))
