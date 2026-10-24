export interface ChartRow {
  label: string;
  value: number;
}

export interface EnrollmentRow {
  label: string;
  enrollments: number;
  cancellations: number;
}

/** Curva suave (Catmull-Rom → Bézier) usada em sparkline e gráfico de área. */
export function smoothPath(p: number[][], t = 0.18): string {
  let d = `M${p[0][0].toFixed(2)},${p[0][1].toFixed(2)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

export function niceScale(maxVal: number, opts: { ticks?: number; int?: boolean } = {}) {
  const ticks = opts.ticks ?? 4;
  const raw = (maxVal || 1) / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  let step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  if (opts.int && step % 1) step = Math.ceil(step);
  return { step, max: Math.ceil(maxVal / step) * step || step };
}

const nf = (o?: Intl.NumberFormatOptions) => new Intl.NumberFormat('pt-BR', o);
export const fmtBRL = (v: number) => nf({ style: 'currency', currency: 'BRL' }).format(v);
export const fmtInt = (v: number) => nf().format(v);
export const fmtPct = (v: number) => nf({ maximumFractionDigits: 1 }).format(v) + '%';
export const fmtCompactBRL = (v: number) =>
  'R$ ' + nf({ notation: 'compact', maximumFractionDigits: 1 }).format(v);
