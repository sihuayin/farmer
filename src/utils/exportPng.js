import { toPng } from 'html-to-image'

export async function exportFarmPng(elementRef, farmName) {
  if (!elementRef) return

  try {
    const dataUrl = await toPng(elementRef, {
      cacheBust: true,
      backgroundColor: '#F0FDF4',
      pixelRatio: 2,
    })

    const link = document.createElement('a')
    link.download = `${farmName || '农场设计'}.png`
    link.href = dataUrl
    link.click()
  } catch (err) {
    console.error('Export PNG failed:', err)
    alert('导出失败，请重试')
  }
}
