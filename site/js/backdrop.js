// Tło z chmurami dot-matrix pod panelem (dekoracja, tworzona w JS)
import { drawClouds, onRedraw } from './dither.js';

const canvas = document.createElement('canvas');
canvas.className = 'backdrop';
canvas.setAttribute('aria-hidden', 'true');
document.body.prepend(canvas);
onRedraw(() => drawClouds(canvas));
