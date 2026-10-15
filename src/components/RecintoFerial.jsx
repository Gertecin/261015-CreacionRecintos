import { useRef, useState } from 'react'
import Scene3D from './3d/Scene3D'
import ConfigPanel from './ui/ConfigPanel'
import { useRecintoStore } from '../store/useRecintoStore'
import { exportarRecintoPDF } from '../utils/exportPDF'

/**
 * Componente principal RecintoFerial - Exportable para otros proyectos
 * 
 * @param {Object} props
 * @param {Function} props.onFinalize - Callback cuando se finaliza el recinto (recibe el objeto recinto)
 * @param {boolean} props.showTabs - Mostrar pestañas de múltiples recintos (default: true)
 * @param {number} props.maxRecintos - Número máximo de recintos (default: 5)
 * 
 * @example
 * <RecintoFerial 
 *   onFinalize={(recinto) => console.log(recinto)}
 *   showTabs={true}
 *   maxRecintos={5}
 * />
 */
export default function RecintoFerial({ 
  onFinalize = null, 
  showTabs = true,
  maxRecintos = 5 
} = {}) {
  const { recintoActivo, setRecintoActivo, recintos, finalizarRecinto } = useRecintoStore()
  const canvasRef = useRef(null)
  const [exportando, setExportando] = useState(false)
  const recintoActual = recintos[recintoActivo]

  const handleExportarPDF = async () => {
    setExportando(true)
    try {
      await exportarRecintoPDF(recintoActual, canvasRef.current)
    } catch (err) {
      console.error('Error exportando PDF:', err)
    }
    setExportando(false)
  }

  const handleFinalizar = () => {
    if (recintoActual.pabellones.length === 0) {
      alert('El recinto no tiene pabellones.')
      return
    }
    if (recintoActual.accesos.length !== 2) {
      alert(`Debes marcar exactamente 2 accesos. Tienes ${recintoActual.accesos.length}.`)
      return
    }
    finalizarRecinto()
    if (onFinalize) {
      onFinalize(recintoActual)
    }
  }

  return (
    <div className="flex h-full w-full bg-gray-100 font-sans" style={{ minHeight: '600px' }}>
      <ConfigPanel 
        onFinalizar={handleFinalizar}
        onExportarPDF={handleExportarPDF}
        exportando={exportando}
      />
      <div className="flex-1 flex flex-col">
        {showTabs && (
          <div className="flex bg-white border-b border-gray-200 px-4 pt-2">
            {recintos.slice(0, maxRecintos).map((r, i) => (
              <button
                key={r.id}
                onClick={() => setRecintoActivo(i)}
                className={`px-6 py-3 font-medium transition-colors ${
                  recintoActivo === i 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {r.nombre}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 relative">
          <Scene3D forwardedRef={canvasRef} />
          <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded text-xs text-gray-600 pointer-events-none">
            Click izq: Rotar | Click der: Mover | Rueda: Zoom
          </div>
        </div>
      </div>
    </div>
  )
}
