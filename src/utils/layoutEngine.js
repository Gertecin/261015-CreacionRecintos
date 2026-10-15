export function calcularLayout(pabellones, espaciosAireLibre, distribucion = 'anillo') {
  const posiciones = []

  // Espacios al aire libre siempre en el centro
  espaciosAireLibre.forEach((espacio, i) => {
    const offset = (i - (espaciosAireLibre.length - 1) / 2) * 8
    posiciones.push({
      ...espacio,
      esAireLibre: true,
      pos: [offset, 0.01, 0],
      escala: Math.sqrt(espacio.m2) * 0.4
    })
  })

  if (pabellones.length === 0) return posiciones

  switch (distribucion) {

    case 'anillo': {
      let perimetroTotal = 0
      pabellones.forEach(p => {
        const lado = Math.sqrt(p.m2) * 0.4
        perimetroTotal += lado * 1.3
      })
      const radio = Math.max(15, perimetroTotal / (2 * Math.PI))
      let anguloActual = 0
      pabellones.forEach((pab) => {
        const lado = Math.sqrt(pab.m2) * 0.4
        const anguloOcupado = (lado * 1.3) / radio
        const anguloAjustado = anguloActual + anguloOcupado / 2 + Math.PI / 2
        posiciones.push({
          ...pab,
          esAireLibre: false,
          pos: [Math.cos(anguloAjustado) * radio, pab.altura / 2, Math.sin(anguloAjustado) * radio],
          escala: lado,
          rotacion: [0, -anguloAjustado + Math.PI / 2, 0]
        })
        anguloActual += anguloOcupado
      })
      break
    }

    case 'u': {
      const ladoBase = 30
      const numLados = Math.ceil(pabellones.length / 3)
      let idx = 0
      // Lado izquierdo (de atrás hacia adelante)
      for (let i = 0; i < numLados && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const z = -ladoBase / 2 + (i * (ladoBase / numLados))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [-ladoBase / 2, pab.altura / 2, z],
          escala: lado, rotacion: [0, Math.PI / 2, 0]
        })
      }
      // Fondo (de izquierda a derecha)
      const numFondo = Math.ceil(pabellones.length / 3)
      for (let i = 0; i < numFondo && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const x = -ladoBase / 2 + (i * (ladoBase / numFondo))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [x, pab.altura / 2, -ladoBase / 2],
          escala: lado, rotacion: [0, 0, 0]
        })
      }
      // Lado derecho (de adelante hacia atrás)
      const numDer = pabellones.length - idx
      for (let i = 0; i < numDer && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const z = ladoBase / 2 - (i * (ladoBase / numDer))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [ladoBase / 2, pab.altura / 2, z],
          escala: lado, rotacion: [0, -Math.PI / 2, 0]
        })
      }
      break
    }

    case 'c': {
      const ladoBase = 30
      const numLados = Math.ceil(pabellones.length / 3)
      let idx = 0
      // Lado izquierdo
      for (let i = 0; i < numLados && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const z = -ladoBase / 2 + (i * (ladoBase / numLados))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [-ladoBase / 2, pab.altura / 2, z],
          escala: lado, rotacion: [0, Math.PI / 2, 0]
        })
      }
      // Fondo
      const numFondo = Math.ceil(pabellones.length / 3)
      for (let i = 0; i < numFondo && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const x = -ladoBase / 2 + (i * (ladoBase / numFondo))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [x, pab.altura / 2, -ladoBase / 2],
          escala: lado, rotacion: [0, 0, 0]
        })
      }
      // Lado derecho
      const numDer = pabellones.length - idx
      for (let i = 0; i < numDer && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const z = ladoBase / 2 - (i * (ladoBase / numDer))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [ladoBase / 2, pab.altura / 2, z],
          escala: lado, rotacion: [0, -Math.PI / 2, 0]
        })
      }
      break
    }

    case 'lineal': {
      const separacion = 2
      let xActual = 0
      pabellones.forEach((pab) => {
        const lado = Math.sqrt(pab.m2) * 0.4
        const x = xActual + lado / 2
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [x, pab.altura / 2, 0],
          escala: lado, rotacion: [0, 0, 0]
        })
        xActual += lado + separacion
      })
      break
    }

    case 'rectangular': {
      const ancho = 40
      const largo = 25
      const porLado = Math.ceil(pabellones.length / 4)
      let idx = 0
      // Arriba
      for (let i = 0; i < porLado && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const x = -ancho / 2 + (i * (ancho / porLado))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [x, pab.altura / 2, -largo / 2],
          escala: lado, rotacion: [0, 0, 0]
        })
      }
      // Derecha
      const porLado2 = Math.ceil((pabellones.length - idx) / 3)
      for (let i = 0; i < porLado2 && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const z = -largo / 2 + (i * (largo / porLado2))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [ancho / 2, pab.altura / 2, z],
          escala: lado, rotacion: [0, -Math.PI / 2, 0]
        })
      }
      // Abajo
      const porLado3 = Math.ceil((pabellones.length - idx) / 2)
      for (let i = 0; i < porLado3 && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const x = ancho / 2 - (i * (ancho / porLado3))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [x, pab.altura / 2, largo / 2],
          escala: lado, rotacion: [0, Math.PI, 0]
        })
      }
      // Izquierda
      for (let i = 0; i < pabellones.length - idx && idx < pabellones.length; i++, idx++) {
        const pab = pabellones[idx]
        const lado = Math.sqrt(pab.m2) * 0.4
        const z = largo / 2 - (i * (largo / (pabellones.length - idx)))
        posiciones.push({
          ...pab, esAireLibre: false,
          pos: [-ancho / 2, pab.altura / 2, z],
          escala: lado, rotacion: [0, Math.PI / 2, 0]
        })
      }
      break
    }

    default:
      break
  }

  return posiciones
}
