// Canvas-generated mock artwork so the clone runs with zero network assets.
// If the original site has its own fallback texture painter, mirror that
// painter's approach and parameters instead of these defaults.

const MOCK_WORDS = ['BRAND', 'DIGITAL', 'MOTION', 'CAMPAIGN', 'EXPERIENCE']

// Full-bleed placeholder texture (slideshow planes, card fills).
export function makeMockTexture(index, w = 1280, h = 820, label = 'MOCK') {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const hue = (index * 47 + 205) % 360

  const grad = ctx.createLinearGradient(0, 0, w * 0.9, h)
  grad.addColorStop(0, `hsl(${hue}, 52%, 20%)`)
  grad.addColorStop(0.55, `hsl(${(hue + 42) % 360}, 46%, 32%)`)
  grad.addColorStop(1, `hsl(${(hue + 95) % 360}, 58%, 14%)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Soft diagonal streaks give warp / RGB-shift shaders something to bite on.
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `hsla(${(hue + i * 24) % 360}, 60%, 60%, 0.06)`
    const x = (w / 5) * i + w * 0.04
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + w * 0.12, 0)
    ctx.lineTo(x + w * 0.3, h)
    ctx.lineTo(x + w * 0.18, h)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${Math.round(h * 0.26)}px "Helvetica Neue", Arial, sans-serif`
  ctx.fillText(String(index + 1).padStart(2, '0'), w * 0.07, h * 0.46)
  ctx.font = `500 ${Math.round(h * 0.045)}px "Helvetica Neue", Arial, sans-serif`
  ctx.fillText(`${label} ${MOCK_WORDS[index % MOCK_WORDS.length]}`, w * 0.075, h * 0.68)
  return canvas
}

// Small gradient thumbnail as a data URL (img src / background swap).
export function makeMockThumbDataUrl(index, w = 240, h = 150, label = 'MOCK') {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const hue = (index * 31 + 160) % 360
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, `hsl(${hue}, 40%, 30%)`)
  grad.addColorStop(1, `hsl(${(hue + 60) % 360}, 40%, 12%)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = '600 20px "Helvetica Neue", Arial, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${label} ${String(index + 1).padStart(2, '0')}`, 14, h / 2)
  return canvas.toDataURL('image/png')
}
