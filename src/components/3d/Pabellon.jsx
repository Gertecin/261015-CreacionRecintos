/**
 * Componente de pabellón 3D
 * @param {Object} props
 * @param {Object} props.data - Datos del pabellón (posición, escala, color, etc.)
 * @param {boolean} props.esAcceso - Si es un pabellón de acceso
 */
export default function Pabellon({ data, esAcceso = false }) {
  const size = data.escala
  const color = esAcceso ? '#ff6600' : data.color
  
  return (
    <mesh position={data.pos} rotation={data.rotacion} castShadow receiveShadow>
      <boxGeometry args={[size, data.altura, size * 0.8]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.3}
        emissive={esAcceso ? '#ff6600' : '#000000'}
        emissiveIntensity={esAcceso ? 0.2 : 0}
      />
    </mesh>
  )
}
