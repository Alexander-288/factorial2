// Tabela: jak błąd trapezów i Simpsona maleje ze wzrostem n
import { f, bisect, trapezoid, simpson, exactArea } from './numerics.js';

const r = bisect(f, 0, 1, 1e-6).root;
const P = exactArea(r);
const fmt = (x) => x.toFixed(9);
const exp = (x) => x.toExponential(2);
const ratio = (prev, cur) => (prev ? (prev / cur).toFixed(1) : '');

let prevT, prevS;
const rows = [2, 4, 8, 16, 32, 64, 128].map((n) => {
  const T = trapezoid(f, -r, r, n), S = simpson(f, -r, r, n);
  const eT = Math.abs(T - P), eS = Math.abs(S - P);
  const row = `<tr><td>${n}</td><td>${fmt(T)}</td><td>${exp(eT)}</td><td>${ratio(prevT, eT)}</td>
    <td>${fmt(S)}</td><td>${exp(eS)}</td><td>${ratio(prevS, eS)}</td></tr>`;
  prevT = eT; prevS = eS;
  return row;
});

document.getElementById('error-table').innerHTML =
  `<thead><tr><th>n</th><th>T_n</th><th>|T_n − P|</th><th>spadek</th><th>S_n</th><th>|S_n − P|</th><th>spadek</th></tr></thead>
   <tbody>${rows.join('')}</tbody>`;

document.getElementById('error-note').textContent =
  `Wartość dokładna P = ${P.toFixed(9)}, liczona z tym samym r co przybliżenia.`;
