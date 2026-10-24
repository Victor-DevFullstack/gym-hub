import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { smoothPath } from '../../utils/chart.utils';

let uid = 0;

@Component({
  selector: 'app-sparkline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vazio()) {
      <svg class="spark spark--empty" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="30" x2="100" y2="30" vector-effect="non-scaling-stroke" />
      </svg>
    } @else {
      <svg class="spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient [attr.id]="id" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="currentColor" stop-opacity=".3" />
            <stop offset="1" stop-color="currentColor" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path [attr.d]="path() + ' L100,40 L0,40 Z'" [attr.fill]="'url(#' + id + ')'" />
        <path class="line" [attr.d]="path()" />
      </svg>
    }
  `,
})
export class Sparkline {
  series = input<number[] | null | undefined>(null);
  empty = input(false);

  protected id = `sg${++uid}`;

  protected vazio = computed(() => this.empty() || !this.series() || this.series()!.length < 2);

  protected path = computed(() => {
    const s = this.series();
    if (!s || s.length < 2) return '';
    const min = Math.min(...s);
    const span = Math.max(...s) - min || 1;
    return smoothPath(s.map((v, i) => [(i * 100) / (s.length - 1), 34 - ((v - min) / span) * 26]));
  });
}
