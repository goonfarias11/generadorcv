/**
 * Optimizador ultra agresivo para PDF - Reemplaza TODOS los estilos inline
 */

export function makeUltraCompact(html) {
  console.log('===COMPACT START===')
  console.log('HTML length before:', html.length)
  
  // 1. FOTO: Cualquier width/height >= 80px → 60px
  html = html.replace(/(<img[^>]*)(width|height):\s*(\d+)px/g, (match, before, prop, size) => {
    const num = parseInt(size)
    if (num >= 80) {
      return `${before}${prop}: 60px`
    }
    return match
  })
  
  // 2. FONT-SIZE: Escala agresiva
  html = html.replace(/font-size:\s*(\d+)px/g, (match, size) => {
    const num = parseInt(size)
    if (num >= 32) return 'font-size: 16px' // h1 nombre
    if (num >= 24) return 'font-size: 14px'
    if (num >= 18) return 'font-size: 11px' // h2 secciones
    if (num >= 14) return 'font-size: 9px'  // contenido
    if (num >= 11) return 'font-size: 8px'  // pequeño
    return match
  })
  
  // 3. PADDING: Máximos
  html = html.replace(/padding:\s*(\d+)px(?:\s+(\d+)px)?/g, (match, v1, v2) => {
    const num1 = parseInt(v1)
    const num2 = v2 ? parseInt(v2) : null
    
    if (num2) {
      // padding: Vpx Hpx
      const newV = num1 >= 40 ? 8 : (num1 >= 20 ? 5 : num1)
      const newH = num2 >= 40 ? 8 : (num2 >= 20 ? 5 : num2)
      return `padding: ${newV}px ${newH}px`
    } else {
      // padding: Xpx
      const newP = num1 >= 50 ? 10 : (num1 >= 30 ? 6 : (num1 >= 20 ? 4 : num1))
      return `padding: ${newP}px`
    }
  })
  
  html = html.replace(/padding-bottom:\s*(\d+)px/g, (match, size) => {
    const num = parseInt(size)
    const newSize = num >= 15 ? 2 : (num >= 8 ? 1 : num)
    return `padding-bottom: ${newSize}px`
  })
  
  // 4. MARGIN-BOTTOM: Compactar todo
  html = html.replace(/margin-bottom:\s*(\d+)px/g, (match, size) => {
    const num = parseInt(size)
    const newSize = num >= 30 ? 3 : (num >= 15 ? 2 : (num >= 8 ? 1 : num))
    return `margin-bottom: ${newSize}px`
  })
  
  // 5. MARGIN genérico
  html = html.replace(/margin:\s*(\d+)px\s+0/g, (match, size) => {
    const num = parseInt(size)
    const newSize = num >= 10 ? 2 : 1
    return `margin: ${newSize}px 0`
  })
  
  html = html.replace(/margin:\s*0\s+0\s+(\d+)px\s+0/g, (match, size) => {
    const num = parseInt(size)
    const newSize = num >= 10 ? 2 : 1
    return `margin: 0 0 ${newSize}px 0`
  })
  
  // 6. LINE-HEIGHT: Todo a 1.0
  html = html.replace(/line-height:\s*[\d.]+/g, 'line-height: 1.0')
  
  // 7. BORDES: Delgados
  html = html.replace(/border(-bottom)?:\s*[234]px/g, '$1: 1px')
  
  // 8. MAX-WIDTH del container
  html = html.replace(/max-width:\s*850px/g, 'max-width: 100%')
  
  console.log('HTML length after:', html.length)
  console.log('===COMPACT END===')
  
  return html
}
