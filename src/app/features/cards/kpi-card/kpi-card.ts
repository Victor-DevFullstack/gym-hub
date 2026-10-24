import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../../../shared/components/icon/icon';
import { IconName } from '../../../shared/components/icon/icons';
import { Sparkline } from '../../../shared/components/sparkline/sparkline';
import { fmtBRL, fmtInt, fmtPct } from '../../../shared/utils/chart.utils';

export interface KpiData {
  key: string;
  label: string;
  icon: IconName;
  tone: 'purple' | 'blue' | 'green' | 'red' | 'amber';
  value: number;
  format: 'int' | 'brl' | 'pct';
  /** Variação % vs período anterior (null = sem base de comparação). */
  delta: number | null;
  series?: number[] | null;
  /** Para indicadores em que cair é bom (cancelamentos). */
  inverse?: boolean;
  zeroText?: string;
  featured?: boolean;
  /** Texto fixo de apoio (ex.: "na academia"); com `plain`, ignora delta e estados "sem dados". */
  note?: string;
  plain?: boolean;
  /** Valor textual (ex.: nome do plano, data). Quando definido, substitui o número formatado. */
  text?: string;
}

@Component({
  selector: 'app-kpi-card',
  imports: [NgTemplateOutlet, RouterLink, Icon, Sparkline],
  templateUrl: './kpi-card.html',
})
export class KpiCard {
  kpi = input.required<KpiData>();
  compare = input('');
  gymEmpty = input(false);

  protected zero = computed(() => !this.kpi().value);
  // Zero "bom" (cancelamentos) não é "sem dados".
  protected noData = computed(() => !this.kpi().plain && this.zero() && (this.gymEmpty() || !this.kpi().inverse));
  protected goodZero = computed(() => !this.kpi().plain && this.zero() && !!this.kpi().inverse && !this.gymEmpty());

  protected valor = computed(() => {
    const k = this.kpi();
    if (k.text !== undefined) return k.text;
    return k.format === 'brl' ? fmtBRL(k.value) : k.format === 'pct' ? fmtPct(k.value) : fmtInt(k.value);
  });

  protected delta = computed(() => {
    const k = this.kpi();
    const d = k.delta;
    if (d === null) return null;
    const dir = d > 0 ? 'up' : d < 0 ? 'down' : 'flat';
    const good = d === 0 ? null : k.inverse ? d < 0 : d > 0;
    return {
      cls: good === null ? 'flat' : good ? 'good' : 'bad',
      glyph: dir === 'up' ? '▲' : dir === 'down' ? '▼' : '–',
      sr: dir === 'up' ? 'aumento de' : dir === 'down' ? 'queda de' : 'sem variação',
      texto: fmtPct(Math.abs(d)),
    };
  });
}
