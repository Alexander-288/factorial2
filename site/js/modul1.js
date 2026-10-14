// Moduł 1: tabela błędów i wykres dot-matrix z liczbą poprawnych cyfr
import { f, bisect, trapezoid, simpson, exactArea } from './numerics.js';
import { palette, onRedraw } from './dither.js';

const r = bisect(f, 0, 1, 1e-6).root;
const P = exactArea(r);
const ns = [2, 4, 8, 16, 32, 64, 128];
const data = ns.map((n) => ({
  n,
  T: trapezoid(f, -r, r, n),
  S: simpson(f, -r, r, n),
}));
data.forEach((d) => { d.eT = Math.abs(d.T - P); d.eS = Math.abs(d.S - P); });

// Tabela
const fmt = (x) => x.toFixed(9);
const exp = (x) => x.toExponential(2);
const rows = data.map((d, i) => {
  const prev = data[i - 1];
  return `<tr><td>${d.n}</td><td>${fmt(d.T)}</td><td>${exp(d.eT)}</td><td>${prev ? (prev.eT / d.eT).toFixed(1) : ''}</td>
    <td>${fmt(d.S)}</td><td>${exp(d.eS)}</td><td>${prev ? (prev.eS / d.eS).toFixed(1) : ''}</td></tr>`;
});
document.getElementById('error-table').innerHTML =
  `<thead><tr><th>n</th><th>Tₙ</th><th>|Tₙ − P|</th><th>spadek</th><th>Sₙ</th><th>|Sₙ − P|</th><th>spadek</th></tr></thead>
   <tbody>${rows.join('')}</tbody>`;

// Wykres: słupki z kropek, wysokość = -log10(błąd)
const canvas = document.getElementById('error-chart');
function drawChart() {
  const p = palette();
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const cell = w < 500 ? 5 : 7, size = cell * 0.7;
  const top = 8, bottom = h - 28, maxDigits = 10;
  const rowsAvail = Math.floor((bottom - top) / cell);
  const group = w / ns.length;
  const barCols = Math.max(2, Math.floor((group * 0.34) / cell));

  ctx.font = '11px "Martian Mono", monospace';
  ctx.textAlign = 'center';
  data.forEach((d, g) => {
    const bars = [[-Math.log10(d.eT), p.ink], [-Math.log10(d.eS), p.accent]];
    bars.forEach(([digits, color], k) => {
      const filled = Math.round((Math.min(digits, maxDigits) / maxDigits) * rowsAvail);
      const x0 = g * group + group / 2 + (k === 0 ? -barCols * cell - 2 : 2);
      for (let row = 0; row < rowsAvail; row++) {
        for (let c = 0; c < barCols; c++) {
          ctx.fillStyle = row < filled ? color : p.line;
          ctx.fillRect(x0 + c * cell, bottom - (row + 1) * cell, size, size);
        }
      }
    });
    ctx.fillStyle = p.muted;
    ctx.fillText(`n=${d.n}`, g * group + group / 2, h - 8);
  });
}
onRedraw(drawChart);
