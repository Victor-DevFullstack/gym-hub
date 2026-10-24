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
import { EnrollmentRow, niceScale } from '../../utils/chart.utils';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.html',
})
export class BarChart {
  rows = input.required<EnrollmentRow[]>();

  private host = viewChild.required<ElementRef<HTMLElement>>('host');
  private destroyRef = inject(DestroyRef);

  protected width = signal(0);
  protected hover = signal<number | null>(null);

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
    const m = { t: 16, r: 8, b: 30, l: 34 };
    const iw = W - m.l - m.r;
    const ih = H - m.t - m.b;
    const base = m.t + ih;
    const gw = iw / rows.length;
    const { max, step } = niceScale(Math.max(...rows.flatMap((r) => [r.enrollments, r.cancellations])), { int: true });
    const Y = (v: number) => m.t + ih - (v / max) * ih;
    const bw = Math.min(14, gw * 0.28);
    const gap = 4;
    const cx = (i: number) => m.l + gw * i + gw / 2;

    const bar = (x: number, v: number): string => {
      const h = base - Y(v);
      if (h <= 0) return '';
      const r = Math.min(5, h / 2);
      const y = Y(v);
      return `M${x},${base} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${base} Z`;
    };

    const ticks: { y: number; label: number }[] = [];
    for (let i = 0; i * step <= max + 1e-9; i++) ticks.push({ y: Y(i * step), label: i * step });

    const groups = rows.map((r, i) => ({
      cx: cx(i),
      label: r.label,
      inPath: bar(cx(i) - bw - gap / 2, r.enrollments),
      outPath: bar(cx(i) + gap / 2, r.cancellations),
    }));

    return { W, H, m, base, gw, ticks, groups, Y };
  });

  protected tip = computed(() => {
    const i = this.hover();
    if (i === null) return null;
    const g = this.geo();
    const r = this.rows()[i];
    const topo = Math.min(g.Y(Math.max(r.enrollments, r.cancellations)), g.base) - 10;
    return {
      bandX: g.m.l + g.gw * i,
      left: Math.min(Math.max(g.groups[i].cx, 70), g.W - 70),
      top: topo,
      row: r,
    };
  });

  protected onMove(event: PointerEvent): void {
    const mx = event.clientX - this.host().nativeElement.getBoundingClientRect().left;
    let idx = 0;
    let best = Infinity;
    this.geo().groups.forEach((gr, i) => {
      const d = Math.abs(gr.cx - mx);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    this.hover.set(idx);
  }
}
