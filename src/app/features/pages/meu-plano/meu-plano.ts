import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType } from '../../../shared/types/usuario';
import { formatarValorPlano, LABEL_POR_PLANO } from '../../../shared/constants/plano.constants';
import { calcularStatusMensalidade, formatarData } from '../../../shared/utils/mensalidade.utils';
import { KpiCard, KpiData } from '../../cards/kpi-card/kpi-card';

@Component({
  selector: 'app-meu-plano',
  imports: [KpiCard],
  templateUrl: './meu-plano.html',
})
export class MeuPlano {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  private aluno = computed<AlunoType | null>(() => {
    const usuario = this.authService.usuarioLogado();
    return usuario?.role === 'aluno' ? usuario : null;
  });

  private personal(): string {
    const personal = this.aluno()?.personal;
    if (!personal || personal === 'sem-personal') return 'Sem personal';
    return this.usuarioService.buscarPorId(personal as unknown as string)?.nome ?? 'Sem personal';
  }

  protected readonly kpis = computed<KpiData[]>(() => {
    const a = this.aluno();
    return [
      { key: 'plano', label: 'Plano', icon: 'wallet', tone: 'purple', format: 'int', value: 0, delta: null, plain: true, text: a?.plano ? LABEL_POR_PLANO[a.plano] : 'Sem plano', note: a?.plano ? formatarValorPlano(a.plano) : '-' },
      { key: 'venc', label: 'Vencimento', icon: 'creditCard', tone: 'blue', format: 'int', value: 0, delta: null, plain: true, text: formatarData(a?.dataDeVencimento ?? null), note: calcularStatusMensalidade(a?.dataDeVencimento ?? null) },
      { key: 'personal', label: 'Personal', icon: 'user', tone: 'green', format: 'int', value: 0, delta: null, plain: true, text: this.personal(), note: '' },
    ];
  });
}
