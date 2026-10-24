import { Component, computed, inject } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType } from '../../../shared/types/usuario';
import { calcularStatusMensalidade } from '../../../shared/utils/mensalidade.utils';
import { KpiCard, KpiData } from '../../cards/kpi-card/kpi-card';

@Component({
  selector: 'app-recepcao',
  imports: [KpiCard],
  templateUrl: './recepcao.html',
})
export class Recepcao {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  protected readonly usuarioLogado = this.authService.usuarioLogado;

  private alunos = computed<AlunoType[]>(() => {
    const academiaId = this.usuarioLogado()?.academiaId;
    if (!academiaId) return [];
    return this.usuarioService.listarPorAcademia(academiaId, 'aluno') as AlunoType[];
  });

  protected readonly kpis = computed<KpiData[]>(() => {
    const hoje = new Date();
    const alunos = this.alunos();
    const novosHoje = alunos.filter((a) => {
      if (!a.dataDeContratacao) return false;
      const d = new Date(a.dataDeContratacao);
      return d.getDate() === hoje.getDate() && d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
    }).length;
    const pendentes = alunos.filter((a) => calcularStatusMensalidade(a.dataDeVencimento) !== 'Pago').length;

    return [
      { key: 'ativos', label: 'Alunos ativos', icon: 'users', tone: 'blue', format: 'int', value: alunos.length, delta: null, plain: true, note: 'na academia' },
      { key: 'pendentes', label: 'Mensalidades pendentes', icon: 'clock', tone: 'amber', format: 'int', value: pendentes, delta: null, plain: true, note: 'aguardando pagamentos' },
      { key: 'novos', label: 'Novos hoje', icon: 'userPlus', tone: 'green', format: 'int', value: novosHoje, delta: null, plain: true, note: 'cadastros' },
    ];
  });
}
