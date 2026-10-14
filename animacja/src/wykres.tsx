// Wspólny układ współrzędnych i kolory obu scen (jak w ciemnym motywie strony)
import {Line} from '@motion-canvas/2d';

export const S = 330;          // pikseli na jednostkę
export const X0 = -400;        // gdzie leży x = 0
export const Y0 = 190;         // gdzie leży y = 0
export const BG = '#0c0c0c';
export const INK = '#f2f2f0';
export const MUTED = '#8d8d89';
export const ACCENT = '#6f93ff';
export const MONO = '"Martian Mono", "Consolas", monospace';

// Punkt matematyczny -> piksele (oś y w górę)
export const P = (x: number, y: number): [number, number] => [X0 + x * S, Y0 - y * S];

// Próbkowanie funkcji na [a, b]
export const sample = (fn: (x: number) => number, a: number, b: number, k = 240) =>
  Array.from({length: k + 1}, (_, i) => {
    const x = a + ((b - a) * i) / k;
    return P(x, fn(x));
  });

// Krzywa narysowana kropkami (styl dot-matrix)
export const dotted = (points: [number, number][], stroke: string) => (
  <Line points={points} stroke={stroke} lineWidth={9} lineCap={'round'} lineDash={[0.1, 15]} />
);

// Osie jako rzadkie kropki
export const axes = () => [
  <Line points={[P(-1.3, 0), P(1.3, 0)]} stroke={MUTED} lineWidth={4} lineCap={'round'} lineDash={[0.1, 15]} />,
  <Line points={[P(0, -0.45), P(0, 1.35)]} stroke={MUTED} lineWidth={4} lineCap={'round'} lineDash={[0.1, 15]} />,
];
