/**
 * Generates clean illustrative synthetic skin-tone daylight swatch cards (SVG data URIs)
 * for demo history records so previews never rely on broken external URLs or fabricated real photos.
 */
function encodeSvg(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`
}

export function createSyntheticSamplePhoto(variant: 'hydrated-1' | 'dry-1' | 'hydrated-2' | 'dry-2' | 'admin-1'): string {
  const configs = {
    'hydrated-1': {
      base: '#dfb89b',
      mid: '#d5a888',
      sheen: '#f6dfd0',
      tag: 'Sampel Simulasi · Cahaya Pagi',
      grain: 0.08,
    },
    'dry-1': {
      base: '#cca284',
      mid: '#b98c6f',
      sheen: '#dfc1aa',
      tag: 'Sampel Simulasi · Ruang AC',
      grain: 0.16,
    },
    'hydrated-2': {
      base: '#d8ad8e',
      mid: '#cb9d7e',
      sheen: '#f3d9c6',
      tag: 'Sampel Simulasi · Setelah Pelembap',
      grain: 0.07,
    },
    'dry-2': {
      base: '#c79b7e',
      mid: '#b48567',
      sheen: '#d8b7a0',
      tag: 'Sampel Simulasi · Sore Hari',
      grain: 0.18,
    },
    'admin-1': {
      base: '#d7ac8c',
      mid: '#c7997a',
      sheen: '#f1d6c2',
      tag: 'Sampel Uji Admin',
      grain: 0.09,
    },
  }

  const c = configs[variant]
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360">
  <defs>
    <radialGradient id="skin" cx="38%" cy="32%" r="72%">
      <stop offset="0%" stop-color="${c.sheen}"/>
      <stop offset="48%" stop-color="${c.base}"/>
      <stop offset="100%" stop-color="${c.mid}"/>
    </radialGradient>
    <pattern id="pores" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="5" r="0.9" fill="#6f4730" opacity="${c.grain}"/>
      <circle cx="13" cy="11" r="0.7" fill="#6f4730" opacity="${c.grain}"/>
      <circle cx="9" cy="16" r="0.6" fill="#fff3ea" opacity="${c.grain * 0.9}"/>
    </pattern>
  </defs>
  <rect width="480" height="360" fill="url(#skin)"/>
  <rect width="480" height="360" fill="url(#pores)"/>
  <rect x="18" y="308" width="248" height="32" rx="16" fill="#211b17" fill-opacity="0.64"/>
  <text x="34" y="329" fill="#faf6ef" font-family="sans-serif" font-size="13" font-weight="600">${c.tag}</text>
</svg>`
  return encodeSvg(svg)
}
