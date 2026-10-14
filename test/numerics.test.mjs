import { test } from 'node:test';
import assert from 'node:assert/strict';
import { f, bisect, trapezoid, simpson, exactArea } from '../site/js/numerics.js';

const close = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('f to cos(x) - x^2', () => {
  close(f(0), 1);
  close(f(1), Math.cos(1) - 1);
});

test('bisekcja: pierwiastek dodatni, 19 iteracji', () => {
  const { root, steps } = bisect(f, 0, 1, 1e-6);
  close(root, 0.824132);
  assert.equal(steps.length, 19);
  assert.deepEqual(Object.keys(steps[0]), ['a', 'b', 'c', 'fa', 'fb', 'fc']);
});

test('bisekcja: pierwiastek ujemny', () => {
  close(bisect(f, -1, 0, 1e-6).root, -0.824132);
});

test('bisekcja: brak zmiany znaku to błąd', () => {
  assert.throws(() => bisect(f, 2, 3, 1e-6));
});

test('trapezy i Simpson zgodne z wartościami kontrolnymi', () => {
  const r = bisect(f, 0, 1, 1e-6).root;
  close(trapezoid(f, -r, r, 4), 1.027278);
  close(trapezoid(f, -r, r, 10), 1.083966);
  close(simpson(f, -r, r, 4), 1.094994);
  close(simpson(f, -r, r, 10), 1.094760);
  close(exactArea(r), 1.094754);
});

test('Simpson wymaga parzystego n', () => {
  assert.throws(() => simpson(f, 0, 1, 3));
});
