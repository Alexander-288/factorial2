// Animacja całkowania: trapezy zagęszczają się, a ich pole dąży do P
import {makeScene2D, Latex, Line, Node, Txt} from '@motion-canvas/2d';
import {createRef, createSignal, waitFor} from '@motion-canvas/core';
import {f, bisect, trapezoid, simpson, exactArea} from '../../../site/js/numerics.js';
import {ACCENT, BG, INK, MONO, MUTED, P, axes, dotted, sample} from '../wykres';

export default makeScene2D(function* (view) {
  view.fill(BG);
  const r = bisect(f, 0, 1, 1e-6).root;
  const area = exactArea(r);
  const n = createSignal(2);
  const fx = (x: number) => x.toFixed(6);

  // Obszar dokładny: po cos x w prawo, po x^2 z powrotem
  const region = [...sample(Math.cos, -r, r), ...sample((x) => x * x, r, -r)];

  // Pasek między krzywymi na [x0, x1]
  const strip = (x0: number, x1: number) => (
    <Line closed points={[P(x0, x0 * x0), P(x1, x1 * x1), P(x1, Math.cos(x1)), P(x0, Math.cos(x0))]}
      fill={'rgba(111,147,255,0.38)'} stroke={ACCENT} lineWidth={2} />
  );
  const strips = (m: number) => {
    const h = (2 * r) / m;
    return Array.from({length: m}, (_, i) => strip(-r + i * h, -r + (i + 1) * h));
  };

  const regionRef = createRef<Line>();
  const limit = createRef<Latex>();
  view.add(<>
    {axes()}
    <Line ref={regionRef} closed points={region} fill={'rgba(242,242,240,0.08)'} opacity={0} />
    {dotted(sample(Math.cos, -1.3, 1.3), ACCENT)}
    {dotted(sample((x) => x * x, -1.12, 1.12), INK)}
    <Latex tex={'P = \\int_{-r}^{r} (\\cos x - x^2)\\,dx'} fill={INK} fontSize={48} x={540} y={-380} />
    <Txt fill={INK} fontFamily={MONO} fontSize={30} lineHeight={52} x={540} y={-130}
      text={() => {
        const T = trapezoid(f, -r, r, n()), Sn = simpson(f, -r, r, n());
        return `n        ${n()}\nTₙ       ${fx(T)}\nSₙ       ${fx(Sn)}\nP        ${fx(area)}\n|Tₙ - P|  ${Math.abs(T - area).toExponential(2)}`;
      }} />
    <Txt fill={MUTED} fontFamily={MONO} fontSize={24} x={540} y={60} text={'trapezy zawsze pod krzywą: f″ < 0'} />
    <Latex ref={limit} tex={'\\lim_{n \\to \\infty} T_n = P'} fill={ACCENT} fontSize={60} x={540} y={250} opacity={0} />
  </>);

  yield* regionRef().opacity(1, 1);

  let current: Node | null = null;
  for (const m of [2, 4, 8, 16, 32, 64]) {
    const group = createRef<Node>();
    view.add(<Node ref={group} opacity={0}>{strips(m)}</Node>);
    n(m);
    if (current) yield* current.opacity(0, 0.35);
    current?.remove();
    yield* group().opacity(1, 0.6);
    current = group();
    yield* waitFor(m < 16 ? 1.6 : 1.1);
  }
  yield* limit().opacity(1, 0.8);
  yield* waitFor(2);
});
