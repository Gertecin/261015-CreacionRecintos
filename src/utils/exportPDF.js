import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Exporta la configuración del recinto a PDF
 * @param {Object} recinto - Objeto del recinto con toda su configuración
 * @param {HTMLElement} containerRef - Referencia al contenedor 3D (opcional)
 */
export async function exportarRecintoPDF(recinto, containerRef = null) {
  const pdf = new jsPDF('landscape', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Capturar la vista 3D como imagen
  let imageData = null
  
  if (containerRef) {
    const canvas = containerRef.querySelector('canvas')
    if (canvas) {
      imageData = canvas.toDataURL('image/png')
    }
  }

  // Fallback a html2canvas si no hay canvas
  if (!imageData) {
    const container = document.getElementById('recinto-3d-container')
    if (container) {
      const canvas = await html2canvas(container, { backgroundColor: '#f0f0f0' })
      imageData = canvas.toDataURL('image/png')
    }
  }

  // Header
  pdf.setFillColor(30, 58, 138)
  pdf.rect(0, 0, pageWidth, 25, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`Recinto Ferial: ${recinto.nombre}`, 15, 16)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Generado: ${new Date().toLocaleString('es-ES')}`, pageWidth - 15, 16, { align: 'right' })

  // Resumen
  pdf.setTextColor(30, 30, 30)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Resumen de configuracion', 15, 38)
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  const totalM2 = recinto.pabellones.reduce((sum, p) => sum + p.m2, 0)
  const totalM2Aire = recinto.espaciosAireLibre.reduce((sum, e) => sum + e.m2, 0)
  
  const resumen = [
    `Distribucion: ${recinto.distribucion.toUpperCase()}`,
    `Pabellones: ${recinto.pabellones.length} / 25`,
    `Espacios Aire Libre: ${recinto.espaciosAireLibre.length} / 3`,
    `Accesos marcados: ${recinto.accesos.length} / 2`,
    `Superficie total pabellones: ${totalM2} m2`,
    `Superficie total aire libre: ${totalM2Aire} m2`,
    `Superficie total recinto: ${totalM2 + totalM2Aire} m2`,
  ]
  
  resumen.forEach((linea, i) => {
    pdf.text(`- ${linea}`, 20, 46 + i * 6)
  })

  // Imagen 3D
  if (imageData) {
    const imgX = 15
    const imgY = 80
    const imgWidth = pageWidth - 30
    const imgHeight = (pageHeight - 110) * 0.7
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.5)
    pdf.rect(imgX - 2, imgY - 2, imgWidth + 4, imgHeight + 4)
    pdf.addImage(imageData, 'PNG', imgX, imgY, imgWidth, imgHeight)
    pdf.setFontSize(8)
    pdf.setTextColor(120, 120, 120)
    pdf.text('Vista 3D del recinto configurado', imgX, imgY + imgHeight + 6)
  }

  // Lista de pabellones
  if (recinto.pabellones.length > 0) {
    const colX = pageWidth / 2 + 5
    pdf.setTextColor(30, 30, 30)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Detalle de pabellones', colX, 38)
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    
    // Cabecera tabla
    pdf.setFillColor(240, 240, 240)
    pdf.rect(colX, 42, pageWidth - colX - 10, 5, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.text('#', colX + 2, 46)
    pdf.text('Tipo', colX + 10, 46)
    pdf.text('m2', colX + 55, 46)
    pdf.text('Acceso', colX + 75, 46)
    
    pdf.setFont('helvetica', 'normal')
    recinto.pabellones.forEach((pab, i) => {
      const y = 50 + i * 5
      if (y > pageHeight - 10) return
      const esAcceso = recinto.accesos.includes(pab.id)
      pdf.text(`${i + 1}`, colX + 2, y)
      pdf.text(pab.tipo, colX + 10, y)
      pdf.text(`${pab.m2}`, colX + 55, y)
      pdf.text(esAcceso ? 'SI' : '-', colX + 75, y)
    })
  }

  // Pie de página
  pdf.setFillColor(30, 58, 138)
  pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.text('261015-CreacionRecintos - Herramienta de configuracion de recintos feriales', pageWidth / 2, pageHeight - 4, { align: 'center' })

  // Guardar
  pdf.save(`${recinto.nombre.replace(/\s+/g, '_')}_${Date.now()}.pdf`)
}
