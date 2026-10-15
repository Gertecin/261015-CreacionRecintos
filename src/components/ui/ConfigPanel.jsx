import { useState } from 'react'
import { useRecintoStore } from '../../store/useRecintoStore'

const DISTRIBUCIONES = [
  { value: 'anillo', label: 'Anillo', icon: '⭕' },
  { value: 'u', label: 'Forma U', icon: 'U' },
  { value: 'c', label: 'Forma C', icon: 'C' },
  { value: 'lineal', label: 'Lineal', icon: '➖' },
  { value: 'rectangular', label: 'Rectangular', icon: '▭' },
]

/**
 * Panel de configuración del recinto
 * @param {Object} props
 * @param {Function} props.onFinalizar - Callback al finalizar
 * @param {Function} props.onExportarPDF - Callback al exportar PDF
 * @param {boolean} props.exportando - Estado de exportación
 */
export default function ConfigPanel({ onFinalizar, onExportarPDF, exportando }) {
  const { 
    addPabellon, deletePabellon, addEspacioAireLibre, resetRecinto, 
    setDistribucion, toggleAcceso, recintos, recintoActivo 
  } = useRecintoStore()
  const [tipo, setTipo] = useState('estandar')
  const [m2Pabellon, setM2Pabellon] = useState(100)
  const [m2AireLibre, setM2AireLibre] = useState(200)
  const recintoActual = recintos[recintoActivo]

  return (
    <div className="w-80 bg-white p-6 shadow-xl h-full overflow-y-auto border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{recintoActual.nombre}</h2>
      <p className="text-sm text-gray-500 mb-6">
        Pabellones: {recintoActual.pabellones.length}/25 | Aire Libre: {recintoActual.espaciosAireLibre.length}/3 | Accesos: {recintoActual.accesos.length}/2
      </p>

      {recintoActual.finalizado && (
        <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 rounded-lg">
          <p className="text-emerald-800 font-semibold text-sm">✓ Recinto finalizado</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Distribucion</h3>
          <div className="grid grid-cols-2 gap-2">
            {DISTRIBUCIONES.map((d) => (
              <button
                key={d.value}
                onClick={() => setDistribucion(d.value)}
                className={`p-2 rounded text-sm font-medium border transition-all ${
                  recintoActual.distribucion === d.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {d.icon} {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Anadir Pabellon</h3>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full p-2 border rounded mb-2">
            <option value="internacional">Internacional</option>
            <option value="nacional">Nacional</option>
            <option value="estandar">Estandar (1-10)</option>
            <option value="maquinaria">Maquinaria Especial</option>
            <option value="salon">Salon Convenviones</option>
          </select>
          <input type="number" value={m2Pabellon} onChange={e => setM2Pabellon(e.target.value)} placeholder="m2" className="w-full p-2 border rounded mb-2" />
          <button onClick={() => addPabellon({ tipo, m2: Number(m2Pabellon) })} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Anadir
          </button>
        </div>

        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Espacio Aire Libre</h3>
          <input type="number" value={m2AireLibre} onChange={e => setM2AireLibre(e.target.value)} placeholder="m2" className="w-full p-2 border rounded mb-2" />
          <button onClick={() => addEspacioAireLibre(Number(m2AireLibre))} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            + Anadir Campo
          </button>
        </div>

        {recintoActual.pabellones.length > 0 && (
          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">Pabellones ({recintoActual.pabellones.length})</h3>
            <p className="text-xs text-gray-500 mb-2">Marca accesos (2) o elimina pabellones</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recintoActual.pabellones.map((pab, idx) => {
                const esAcceso = recintoActual.accesos.includes(pab.id)
                return (
                  <div key={pab.id} className="flex gap-2 items-center">
                    <button
                      onClick={() => toggleAcceso(pab.id)}
                      className={`flex-1 p-2 rounded text-sm border transition-all text-left ${
                        esAcceso
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                      }`}
                    >
                      {esAcceso ? '✓ ' : ''}{idx + 1}. {pab.tipo} ({pab.m2}m²)
                    </button>
                    <button
                      onClick={() => deletePabellon(pab.id)}
                      className="p-2 rounded bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 transition-all text-sm font-bold"
                      title="Eliminar pabellon"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <button 
            onClick={onFinalizar}
            disabled={exportando}
            className="w-full bg-emerald-600 text-white p-3 rounded font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✓ Finalizar recinto
          </button>
          
          <button 
            onClick={onExportarPDF}
            disabled={exportando}
            className="w-full bg-indigo-600 text-white p-2 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            Exportar PDF
          </button>

          <button 
            onClick={() => { onFinalizar(); setTimeout(onExportarPDF, 100); }}
            disabled={exportando}
            className="w-full bg-purple-600 text-white p-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
          >
            Finalizar y exportar PDF
          </button>
        </div>

        <button onClick={resetRecinto} className="w-full bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 mt-4">
          Limpiar Recinto
        </button>
      </div>
    </div>
  )
}
