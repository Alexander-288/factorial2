// Animacja bisekcji: zawężanie przedziału [a, b] wokół pierwiastka x^2 - cos(x) = 0
import {makeScene2D, Circle, Latex, Line, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, createSignal, waitFor} from '@motion-canvas/core';
import {f, bisect} from '../../../site/js/numerics.js';
import {ACCENT, BG, INK, MONO, MUTED, P, S, Y0, axes, dotted, sample} from '../wykres';

export default makeScene2D(function* (view) {
  view.fill(BG);
  const {root, steps} = bisect(f, 0, 1, 1e-6);

  const a = createSignal(0);
  const b = createSignal(1);
  const k = createSignal(0);
  const c = () => (a() + b()) / 2;
  const fx = (x: number) => x.toFixed(6);

  const band = createRef<Rect>();
  const dot = createRef<Circle>();
  const panel = createRef<Txt>();
  const result = createRef<Latex>();

  view.add(<>
    {axes()}
    <Rect ref={band} x={() => P(c(), 0)[0]} y={Y0 - 0.45 * S} width={() => Math.max(2, (b() - a()) * S)}
      height={1.8 * S} fill={'rgba(111,147,255,0.14)'} stroke={ACCENT} lineWidth={2} opacity={0} />
    {dotted(sample(f, -1.06, 1.06), INK)}
    <Circle ref={dot} size={20} fill={ACCENT} position={() => P(c(), 0)} opacity={0} />
    <Latex tex={'f(x) = \\cos x - x^2'} fill={INK} fontSize={52} x={520} y={-380} />
    <Txt fill={MUTED} fontFamily={MONO} fontSize={26} x={520} y={-300} text={'szukamy f(x) = 0 na [0, 1]'} />
    <Txt ref={panel} fill={INK} fontFamily={MONO} fontSize={30} lineHeight={52} x={520} y={-90}
      text={() => `k        ${k()}\na        ${fx(a())}\nb        ${fx(b())}\nc        ${fx(c())}\nf(c)     ${fx(f(c()))}\n(b-a)/2  ${((b() - a()) / 2).toExponential(2)}`} />
    <Latex ref={result} tex={`x = \\pm ${root.toFixed(6)}`} fill={ACCENT} fontSize={64} x={520} y={250} opacity={0} />
  </>);

  yield* band().opacity(1, 0.8);
  yield* dot().opacity(1, 0.4);

  // Pierwsze kroki wolno, potem coraz szybciej
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const slow = i < 6;
    yield* waitFor(slow ? 0.5 : 0.12);
    k(i + 1);
    const keepLeft = s.fa * s.fc < 0;
    yield* all(keepLeft ? b(s.c, slow ? 0.7 : 0.18) : a(s.c, slow ? 0.7 : 0.18));
  }
  yield* result().opacity(1, 0.8);
  yield* waitFor(2);
});
