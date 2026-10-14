// Strona startowa: wykres dot-matrix i znaczki modułów
import { draw, palette, areaScene, drawStamps, onRedraw } from './dither.js';

const plot = document.getElementById('hero-plot');
const canvas = plot.querySelector('canvas');

function render() {
  const view = { cx: 0, cy: 0.55, span: 1.9 };
  draw(canvas, areaScene(palette()), { cell: canvas.clientWidth < 600 ? 5 : 7, view });

  // Etykiety w tych samych współrzędnych co wykres
  const w = canvas.clientWidth, h = canvas.clientHeight, unit = Math.min(w, h) / view.span;
  plot.querySelectorAll('.plot-label').forEach((el) => {
    el.style.left = `${w / 2 + (Number(el.dataset.x) - view.cx) * unit}px`;
    el.style.top = `${h / 2 - (Number(el.dataset.y) - view.cy) * unit}px`;
  });
  drawStamps();
}

onRedraw(render);
