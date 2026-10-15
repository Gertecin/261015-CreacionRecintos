/**
 * Punto de entrada para importar el módulo en otros proyectos
 * 
 * @example
 * import { RecintoFerial, useRecintoStore, exportarRecintoPDF } from '261015-CreacionRecintos'
 */

export { default as RecintoFerial } from './components/RecintoFerial'
export { useRecintoStore } from './store/useRecintoStore'
export { exportarRecintoPDF } from './utils/exportPDF'
export { calcularLayout } from './utils/layoutEngine'
