import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ChartRow, fmtBRL, fmtCompactBRL, niceScale, smoothPath } from '../../utils/chart.utils';

let uid = 0;

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.html',
})
export class AreaChart {
  rows = input.required<ChartRow[]>();

  private host = viewChild.required<ElementRef<HTMLElement>>('host');
  private destroyRef = inject(DestroyRef);

  protected gradId = `revGrad${++uid}`;
  protected width = signal(0);
  protected hover = signal<number | null>(null);
  protected fmtBRL = fmtBRL;

  constructor() {
    afterNextRender(() => {
      const el = this.host().nativeElement;
      this.width.set(Math.round(el.clientWidth));
      const ro = new ResizeObserver((e) => this.width.set(Math.round(e[0].contentRect.width)));
      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  protected geo = computed(() => {
    const rows = this.rows();
    const W = this.width() || 320;
    const H = 260;
    const m = { t: 16, r: 12, b: 30, l: 56 };
    const pad = 16;
    const iw = W - m.l - m.r;
    const ih = H - m.t - m.b;
    const base = m.t + ih;
    const { max, step } = niceScale(Math.max(...rows.map((r) => r.value)));
    const X = (i: number) => m.l + pad + (rows.length > 1 ? (i * (iw - pad * 2)) / (rows.length - 1) : (iw - pad * 2) / 2);
    const Y = (v: number) => m.t + ih - (v / max) * ih;
    const pts = rows.map((r, i) => [X(i), Y(r.value)]);
    const line = smoothPath(pts);

    const ticks: { y: number; label: string }[] = [];
    for (let i = 0; i * step <= max + 1e-9; i++) ticks.push({ y: Y(i * step), label: fmtCompactBRL(i * step) });

    return {
      W, H, m, base, pts, line, ticks,
      area: `${line} L${pts[pts.length - 1][0]},${base} L${pts[0][0]},${base} Z`,
    };
  });

  protected tip = computed(() => {
    const i = this.hover();
    if (i === null) return null;
    const g = this.geo();
    const r = this.rows()[i];
    return {
      i,
      x: g.pts[i][0],
      y: g.pts[i][1],
      left: Math.min(Math.max(g.pts[i][0], 70), g.W - 70),
      top: g.pts[i][1] - 14,
      label: r.label,
      value: fmtBRL(r.value),
    };
  });

  protected onMove(event: PointerEvent): void {
    const mx = event.clientX - this.host().nativeElement.getBoundingClientRect().left;
    let idx = 0;
    let best = Infinity;
    this.geo().pts.forEach((p, i) => {
      const d = Math.abs(p[0] - mx);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    this.hover.set(idx);
  }
}
