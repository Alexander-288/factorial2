// Rysowanie "dot-matrix": gęstość 0..1 zamieniana na kropki ditheringiem Bayera
import { f, bisect } from './numerics.js';

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((row) => row.map((v) => (v + 0.5) / 16));

// Kolory z tokenów CSS (zależne od motywu)
export function palette() {
  const s = getComputedStyle(document.documentElement);
  const get = (n) => s.getPropertyValue(n).trim();
  return { ink: get('--ink'), muted: get('--muted'), accent: get('--accent'), line: get('--line') };
}

// scene(x, y) zwraca [gęstość, kolor] dla punktu w jednostkach sceny
export function draw(canvas, scene, { cell = 6, dot = 0.62, view }) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // Skala jednakowa w obu osiach, środek widoku w środku płótna
  const { cx, cy, span } = view;
  const unit = Math.min(w, h) / span;
  const size = cell * dot, pad = (cell - size) / 2;
  const cols = Math.floor(w / cell), rows = Math.floor(h / cell);
  const ox = (w - cols * cell) / 2, oy = (h - rows * cell) / 2;
  const px = unit === 0 ? 0 : 1 / unit;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const sx = ox + i * cell + cell / 2, sy = oy + j * cell + cell / 2;
      const x = cx + (sx - w / 2) / unit, y = cy - (sy - h / 2) / unit;
      const [d, color] = scene(x, y, cell * px);
      if (d > BAYER[j % 4][i % 4]) {
        ctx.fillStyle = color;
        ctx.fillRect(ox + i * cell + pad, oy + j * cell + pad, size, size);
      }
    }
  }
}

// Odległość punktu od wykresu y = g(x) (przybliżenie przez nachylenie)
const near = (x, y, g, dg) => Math.abs(y - g(x)) / Math.sqrt(1 + dg(x) ** 2);
const cosC = [Math.cos, (x) => -Math.sin(x)];
const sqC = [(x) => x * x, (x) => 2 * x];
export const r = bisect(f, 0, 1, 1e-6).root;
const inside = (x, y) => Math.abs(x) < r && y > x * x && y < Math.cos(x);

// Scena główna: obie krzywe, obszar i delikatna "aureola" wokół niego
export function areaScene(p, { trapezoids = 0 } = {}) {
  return (x, y, c) => {
    if (near(x, y, ...cosC) < c * 0.8) return [1, p.accent];
    if (near(x, y, ...sqC) < c * 0.8) return [1, p.ink];
    if (inside(x, y)) {
      if (trapezoids) {
        const k = Math.floor(((x + r) / (2 * r)) * trapezoids);
        return [k % 2 ? 0.75 : 0.4, p.accent];
      }
      return [0.5, p.accent];
    }
    if (Math.abs(y) < c * 0.5 || Math.abs(x) < c * 0.5) return [0.3, p.muted];
    const dy = Math.min(Math.abs(y - Math.cos(x)), Math.abs(y - x * x));
    return [Math.max(0, 0.16 - dy * 0.35), p.muted];
  };
}

// Proste sceny do znaczków modułów
export const stampScenes = {
  // Moduł 1: obszar między krzywymi
  area: (p) => ({ scene: areaScene(p), view: { cx: 0, cy: 0.55, span: 1.7 } }),
  // Moduł 2: linie kodu
  code: (p) => ({
    view: { cx: 0, cy: 0, span: 2 },
    scene: (x, y) => {
      const lens = [1.2, 0.7, 1.6, 0.9, 1.3, 0.5];
      const row = Math.floor((0.95 - y) / 0.3);
      const inRow = (0.95 - y) % 0.3 < 0.16 && row >= 0 && row < lens.length;
      const indent = row % 3 === 1 ? 0.3 : 0;
      if (inRow && x > -1.5 + indent && x < -1.5 + indent + lens[row]) return [0.85, row === 0 ? p.accent : p.ink];
      return [0.04, p.muted];
    },
  }),
  // Moduł 3: siatka arkusza
  sheet: (p) => ({
    view: { cx: 0, cy: 0, span: 2 },
    scene: (x, y, c) => {
      const onGrid = Math.abs(((x + 2) % 0.5) - 0.25) > 0.25 - c * 0.6 || Math.abs(((y + 2) % 0.33) - 0.165) > 0.165 - c * 0.6;
      if (onGrid) return [0.9, p.ink];
      if (y > 0.67) return [0.35, p.accent];
      return [0.06, p.muted];
    },
  }),
  // Moduł 4: trapezy pod suwakiem n
  geo: (p) => ({ scene: areaScene(p, { trapezoids: 6 }), view: { cx: 0, cy: 0.55, span: 1.7 } }),
  // Moduł 5: słupki dążące do granicy
  anim: (p) => ({
    view: { cx: 0, cy: 0, span: 2 },
    scene: (x, y, c) => {
      const k = Math.floor((x + 1.7) / 0.34);
      const top = -0.9 + 1.6 * (1 - Math.pow(0.6, k + 1));
      if (Math.abs(y - 0.7) < c * 0.6) return [0.6, p.accent];
      if (k >= 0 && k < 10 && y > -0.9 && y < top && (x + 1.7) % 0.34 < 0.26) return [0.9, p.ink];
      return [0.04, p.muted];
    },
  }),
};

// Rysuje wszystkie znaczki [data-stamp] na stronie
export function drawStamps() {
  const p = palette();
  document.querySelectorAll('canvas[data-stamp]').forEach((cv) => {
    const { scene, view } = stampScenes[cv.dataset.stamp](p);
    draw(cv, scene, { cell: 4, view });
  });
}

// Przerysowanie po zmianie motywu lub rozmiaru
export function onRedraw(fn) {
  fn();
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fn, 120); });
  new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', fn);
}
