// f(x) = cos(x) - x^2; jej zera to punkty przecięcia krzywych
export const f = (x) => Math.cos(x) - x * x;

// Bisekcja na [a, b] z dokładnością eps; zwraca pierwiastek i kroki
export function bisect(fn, a, b, eps = 1e-6) {
  if (fn(a) * fn(b) > 0) throw new Error('Brak zmiany znaku na przedziale');
  const steps = [];
  while ((b - a) / 2 >= eps) {
    const c = (a + b) / 2;
    steps.push({ a, b, c, fa: fn(a), fb: fn(b), fc: fn(c) });
    if (fn(a) * fn(c) < 0) b = c;
    else a = c;
  }
  return { root: (a + b) / 2, steps };
}

// Złożona metoda trapezów, n podprzedziałów
export function trapezoid(fn, a, b, n) {
  const h = (b - a) / n;
  let sum = (fn(a) + fn(b)) / 2;
  for (let i = 1; i < n; i++) sum += fn(a + i * h);
  return h * sum;
}

// Złożona metoda Simpsona, n parzyste
export function simpson(fn, a, b, n) {
  if (n % 2 !== 0) throw new Error('n musi być parzyste');
  const h = (b - a) / n;
  let sum = fn(a) + fn(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * fn(a + i * h);
  return (h / 3) * sum;
}

// Pole dokładne: całka z cos(x) - x^2 od -r do r
export const exactArea = (r) => 2 * Math.sin(r) - (2 * r ** 3) / 3;
