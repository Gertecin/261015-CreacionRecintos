/**
 * Componente de espacio al aire libre (plano en el suelo)
 * @param {Object} props
 * @param {Object} props.data - Datos del espacio (posición, escala)
 */
export default function EspacioAireLibre({ data }) {
  const size = data.escala
  return (
    <mesh position={data.pos} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size * 0.8]} />
      <meshStandardMaterial color="#e0e0e0" transparent opacity={0.6} side={2} />
    </mesh>
  )
}
