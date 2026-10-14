// Moduł 3: te same tabele co w arkuszu, liczone w przeglądarce
import { f, bisect } from './numerics.js';

const fx = (x) => x.toFixed(6);
const { root: r, steps } = bisect(f, 0, 1, 1e-6);

document.getElementById('bisect-table').innerHTML =
  '<thead><tr><th>k</th><th>a</th><th>b</th><th>c</th><th>f(a)</th><th>f(b)</th><th>f(c)</th></tr></thead><tbody>' +
  steps.map((s, k) => `<tr><td>${k + 1}</td><td>${fx(s.a)}</td><td>${fx(s.b)}</td><td>${fx(s.c)}</td>
    <td>${fx(s.fa)}</td><td>${fx(s.fb)}</td><td>${fx(s.fc)}</td></tr>`).join('') + '</tbody>';

const n = 10, a = -r, h = (2 * r) / n;
const rows = [];
for (let i = 0; i <= n; i++) {
  const x = a + i * h;
  const wT = i === 0 || i === n ? '1/2' : '1';
  const wS = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
  rows.push(`<tr><td>${i}</td><td>${fx(x)}</td><td>${fx(f(x))}</td><td>${wT}</td><td>${wS}</td></tr>`);
}
document.getElementById('int-table').innerHTML =
  '<thead><tr><th>i</th><th>xᵢ</th><th>f(xᵢ)</th><th>waga, trapezy</th><th>waga, Simpson</th></tr></thead><tbody>' +
  rows.join('') + '</tbody>';

// Brak pliku arkusza lub zrzutu: informacja zamiast martwego linku
const pending = (text) => Object.assign(document.createElement('p'), { className: 'pending', textContent: text });
fetch('pliki/obszar.xlsx', { method: 'HEAD' }).then((res) => {
  if (!res.ok) document.getElementById('xlsx').replaceWith(pending('Arkusz w przygotowaniu (Kordian Nastały).'));
}).catch(() => {});
const img = document.querySelector('img.shot');
const swap = () => img.replaceWith(pending('Zrzut ekranu arkusza w przygotowaniu.'));
if (img.complete && img.naturalWidth === 0) swap();
else img.addEventListener('error', swap);
