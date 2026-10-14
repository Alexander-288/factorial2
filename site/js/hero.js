// Wykres na stronie startowej: obie krzywe i zacieniowany obszar między nimi
import { f, bisect, exactArea } from './numerics.js';

const W = 640, H = 340, S = 190;          // rozmiar i skala (px na jednostkę)
const X0 = W / 2, Y0 = 280;               // położenie punktu (0, 0)
const px = (x, y) => `${(X0 + x * S).toFixed(1)},${(Y0 - y * S).toFixed(1)}`;
const path = (fn, a, b, k = 120) =>
  Array.from({ length: k + 1 }, (_, i) => { const x = a + ((b - a) * i) / k; return px(x, fn(x)); }).join(' ');

const r = bisect(f, 0, 1, 1e-6).root;
const sq = (x) => x * x;
const region = path(Math.cos, -r, r) + ' ' + path(sq, r, -r);

document.getElementById('hero-plot').innerHTML = `
<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Wykres y = cos x i y = x^2 z zacieniowanym obszarem między punktami przecięcia">
  <line x1="12" y1="${Y0}" x2="${W - 12}" y2="${Y0}" stroke="var(--muted)" stroke-width="1"/>
  <line x1="${X0}" y1="${H - 8}" x2="${X0}" y2="10" stroke="var(--muted)" stroke-width="1"/>
  <polygon points="${region}" fill="var(--area)"/>
  <polyline points="${path(Math.cos, -1.6, 1.6)}" fill="none" stroke="var(--cos)" stroke-width="2.5"/>
  <polyline points="${path(sq, -1.38, 1.38)}" fill="none" stroke="var(--sq)" stroke-width="2.5"/>
  <line x1="${X0 - r * S}" y1="${Y0}" x2="${X0 - r * S}" y2="${Y0 - sq(r) * S}" stroke="var(--muted)" stroke-dasharray="3 4"/>
  <line x1="${X0 + r * S}" y1="${Y0}" x2="${X0 + r * S}" y2="${Y0 - sq(r) * S}" stroke="var(--muted)" stroke-dasharray="3 4"/>
  <circle cx="${X0 - r * S}" cy="${Y0 - sq(r) * S}" r="4.5" fill="var(--ink)"/>
  <circle cx="${X0 + r * S}" cy="${Y0 - sq(r) * S}" r="4.5" fill="var(--ink)"/>
  <g font-family="IBM Plex Mono, monospace" font-size="13" fill="var(--muted)">
    <text x="${X0 - r * S}" y="${Y0 + 20}" text-anchor="middle">−${r.toFixed(4)}</text>
    <text x="${X0 + r * S}" y="${Y0 + 20}" text-anchor="middle">${r.toFixed(4)}</text>
  </g>
  <g font-family="IBM Plex Sans, sans-serif" font-size="15">
    <text x="${X0 + 1.2 * S}" y="${Y0 - Math.cos(1.2) * S - 12}" fill="var(--cos)">y = cos x</text>
    <text x="${X0 - 1.12 * S - 10}" y="${Y0 - 1.25 * S}" fill="var(--sq)" text-anchor="end">y = x²</text>
    <text x="${X0}" y="${Y0 - 0.42 * S}" fill="var(--ink)" text-anchor="middle" font-weight="600">P ≈ ${exactArea(r).toFixed(4)}</text>
  </g>
</svg>`;
