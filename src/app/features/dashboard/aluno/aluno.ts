import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType } from '../../../shared/types/usuario';
import { tituloCase } from '../../../shared/utils/data.utils';
import { formatarData } from '../../../shared/utils/mensalidade.utils';
import { KpiCard, KpiData } from '../../cards/kpi-card/kpi-card';

@Component({
  selector: 'app-aluno',
  imports: [KpiCard],
  templateUrl: './aluno.html',
})
export class Aluno {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  protected readonly aluno = computed<AlunoType | null>(() => {
    const usuario = this.authService.usuarioLogado();
    return usuario?.role === 'aluno' ? usuario : null;
  });

  private estaPago(): string {
    const venc = this.aluno()?.dataDeVencimento;
    if (!venc) return 'Sem plano';
    return new Date() > new Date(venc) ? 'Atrasado' : 'Pago';
  }

  private planoAtivo(): string {
    const venc = this.aluno()?.dataDeVencimento;
    if (!venc) return 'Sem plano';
    return new Date() > new Date(venc) ? 'Plano inativo' : 'Plano ativo';
  }

  private personal(): string {
    const personal = this.aluno()?.personal;
    if (!personal || personal === 'sem-personal') return 'Sem personal';
    return this.usuarioService.buscarPorId(personal as unknown as string)?.nome ?? 'Sem personal';
  }

  protected readonly kpis = computed<KpiData[]>(() => {
    const a = this.aluno();
        return [
      { key: 'plano', label: 'Plano atual', icon: 'users', tone: 'blue', format: 'int', value: 0, delta: null, plain: true, text: a?.plano ? tituloCase(a.plano) : 'Sem plano', note: this.planoAtivo() },
      { key: 'venc', label: 'Próximo vencimento', icon: 'clock', tone: 'amber', format: 'int', value: 0, delta: null, plain: true, text: formatarData(a?.dataDeVencimento ?? null), note: this.estaPago() },
      { key: 'personal', label: 'Personal', icon: 'dumbbell', tone: 'purple', format: 'int', value: 0, delta: null, plain: true, text: this.personal(), note: '' },
    ];
  });
}
