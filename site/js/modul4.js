// Moduł 4: aplet GeoGebry budowany komendami + panel wartości z numerics.js
import { f, bisect, trapezoid, simpson, exactArea } from './numerics.js';
import { palette } from './dither.js';

const r = bisect(f, 0, 1, 1e-6).root;
const P = exactArea(r);

// Metoda prostokątów (punkt środkowy)
const midpoint = (n) => {
  const h = (2 * r) / n;
  let s = 0;
  for (let i = 0; i < n; i++) s += f(-r + (i + 0.5) * h);
  return h * s;
};

const commands = [
  'f(x) = cos(x)',
  'g(x) = x^2',
  'd(x) = f(x) - g(x)',
  'r = x(Root(d, 0.8))',
  'n = Slider(2, 60, 1)',
  'SetValue(n, 4)',
  'h = 2r / n',
  'prost = Checkbox("Prostokąty")',
  'SetValue(prost, false)',
  'pole = IntegralBetween(f, g, -r, r)',
  'trapezy = Sequence(Polygon((-r + i h, g(-r + i h)), (-r + (i + 1) h, g(-r + (i + 1) h)), (-r + (i + 1) h, f(-r + (i + 1) h)), (-r + i h, f(-r + i h))), i, 0, n - 1)',
  'prostokaty = Sequence(Polygon((-r + i h, g(-r + (i + 0.5) h)), (-r + (i + 1) h, g(-r + (i + 0.5) h)), (-r + (i + 1) h, f(-r + (i + 0.5) h)), (-r + i h, f(-r + (i + 0.5) h))), i, 0, n - 1)',
  'A = (-r, g(-r))',
  'B = (r, g(r))',
];

const set = (id, text) => { document.getElementById(id).textContent = text; };
function updatePanel(n) {
  const T = trapezoid(f, -r, r, n), M = midpoint(n);
  set('v-n', String(n));
  set('v-h', ((2 * r) / n).toFixed(6));
  set('v-t', T.toFixed(6));
  set('e-t', `błąd ${Math.abs(T - P).toExponential(2)}`);
  set('v-m', M.toFixed(6));
  set('e-m', `błąd ${Math.abs(M - P).toExponential(2)}`);
  if (n % 2 === 0) {
    const S = simpson(f, -r, r, n);
    set('v-s', S.toFixed(6));
    set('e-s', `błąd ${Math.abs(S - P).toExponential(2)}`);
  } else {
    set('v-s', '—');
    set('e-s', 'wymaga parzystego n');
  }
  set('v-p', P.toFixed(6));
}

// "#rrggbb" -> [r, g, b]
const rgb = (hex) => {
  const v = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
};

// Kolory apletu z tokenów strony (jasny / ciemny motyw)
function applyTheme(api) {
  const p = palette();
  const paper = getComputedStyle(document.documentElement).getPropertyValue('--chip').trim();
  api.setColor('f', ...rgb(p.accent));
  api.setColor('g', ...rgb(p.ink));
  api.setColor('pole', ...rgb(p.accent));
  api.setColor('trapezy', ...rgb(p.accent));
  api.setColor('prostokaty', ...rgb(p.accent));
  api.setColor('A', ...rgb(p.ink));
  api.setColor('B', ...rgb(p.ink));
  api.setColor('n', ...rgb(p.ink));
  api.setColor('prost', ...rgb(p.ink));
  try {
    api.setGraphicsOptions(1, { bgColor: paper, axesColor: p.muted, gridColor: p.line, gridIsBold: false });
  } catch {
    api.evalCommand(`SetBackgroundColor("${paper}")`);
  }
}

const host = document.getElementById('ggb');
const width = Math.round(host.clientWidth);
const height = Math.round(Math.min(520, Math.max(300, width * 0.62)));
host.style.height = `${height}px`;

const applet = new window.GGBApplet({
  appName: 'classic',
  width,
  height,
  showToolBar: false,
  showAlgebraInput: false,
  showMenuBar: false,
  showResetIcon: false,
  enableRightClick: false,
  enableShiftDragZoom: true,
  borderColor: 'none',
  perspective: 'G',
  language: 'pl',
  appletOnLoad(api) {
    commands.forEach((c) => api.evalCommand(c));
    api.setLineThickness('f', 6);
    api.setLineThickness('g', 6);
    api.setFilling('pole', 0.12);
    api.setFilling('trapezy', 0.45);
    api.setFilling('prostokaty', 0.45);
    api.setLineThickness('trapezy', 3);
    api.setLineThickness('prostokaty', 3);
    ['trapezy', 'prostokaty', 'pole', 'A', 'B', 'f', 'g'].forEach((o) => api.setLabelVisible(o, false));
    ['d', 'h', 'r'].forEach((o) => api.setVisible(o, false));
    api.evalCommand('SetConditionToShowObject(trapezy, !prost)');
    api.evalCommand('SetConditionToShowObject(prostokaty, prost)');
    api.setFixed('n', true, true);
    api.setFixed('prost', true, true);
    api.setCoordSystem(-1.7, 1.7, -0.35, 1.45);
    api.evalCommand('SetCoords(n, 20, 30)');
    api.evalCommand('SetCoords(prost, 20, 80)');
    applyTheme(api);

    api.registerObjectUpdateListener('n', () => updatePanel(api.getValue('n')));
    updatePanel(api.getValue('n'));

    new MutationObserver(() => applyTheme(api)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(api));

    // Zapis aktualnego stanu apletu jako plik .ggb
    document.getElementById('ggb-download').addEventListener('click', () => {
      api.getBase64((b64) => {
        const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.geogebra.file' }));
        a.download = 'obszar.ggb';
        a.click();
      });
    });
  },
}, true);
applet.inject('ggb');
