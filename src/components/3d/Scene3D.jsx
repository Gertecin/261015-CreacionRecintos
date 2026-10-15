import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import Pabellon from './Pabellon'
import EspacioAireLibre from './EspacioAireLibre'
import { calcularLayout } from '../../utils/layoutEngine'
import { useRecintoStore } from '../../store/useRecintoStore'

/**
 * Componente de flecha para marcar accesos
 */
function FlechaAcceso({ posicion, rotacion }) {
  return (
    <group position={posicion} rotation={rotacion}>
      <mesh position={[0, 0.1, -2]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.5, 1.5, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.05, -1]}>
        <boxGeometry args={[0.3, 0.1, 2]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

/**
 * Escena 3D principal del recinto
 * @param {Object} props
 * @param {React.RefObject} props.forwardedRef - Referencia al canvas para exportación
 */
export default function Scene3D({ forwardedRef }) {
  const { recintos, recintoActivo } = useRecintoStore()
  const recinto = recintos[recintoActivo]
  const elementos = calcularLayout(recinto.pabellones, recinto.espaciosAireLibre, recinto.distribucion)
  const containerRef = useRef(null)

  return (
    <div id="recinto-3d-container" ref={containerRef} className="w-full h-full" style={{ background: '#f5f5f5' }}>
      <Canvas 
        ref={forwardedRef}
        shadows 
        camera={{ position: [35, 25, 35], fov: 45 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[15, 20, 10]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        <Grid args={[100, 100]} cellSize={1} cellThickness={0.5} cellColor="#ccc" sectionSize={5} sectionThickness={1} sectionColor="#999" fadeDistance={50} />
        
        {elementos.map((el) => {
          if (el.esAireLibre) {
            return <EspacioAireLibre key={el.id} data={el} />
          }
          const esAcceso = recinto.accesos.includes(el.id)
          return (
            <group key={el.id}>
              <Pabellon data={el} esAcceso={esAcceso} />
              {esAcceso && <FlechaAcceso posicion={el.pos} rotacion={el.rotacion} />}
            </group>
          )
        })}
        
        <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={10} maxDistance={80} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
