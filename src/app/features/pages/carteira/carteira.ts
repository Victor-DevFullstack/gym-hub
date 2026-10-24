import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType } from '../../../shared/types/usuario';
import { formatarValorPlano, VALOR_POR_PLANO } from '../../../shared/constants/plano.constants';
import { calcularStatusMensalidade, formatarData, StatusMensalidade } from '../../../shared/utils/mensalidade.utils';
import { iniciais, tomDoAvatar } from '../../../shared/utils/data.utils';
import { Icon } from '../../../shared/components/icon/icon';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { KpiCard, KpiData } from '../../cards/kpi-card/kpi-card';

const TOM_STATUS: Record<StatusMensalidade, string> = { Pago: 'green', Pendente: 'amber', Atrasado: 'red' };

type Visao = 'pendentes' | 'todas' | 'pagas';

interface LinhaCarteira {
  id: string;
  nome: string;
  plano: string;
  valor: string;
  vencimento: string;
  status: StatusMensalidade;
  tom: string;
}

@Component({
  selector: 'app-carteira',
  imports: [TitleCasePipe, Icon, EmptyState, KpiCard],
  templateUrl: './carteira.html',
})
export class Carteira {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  private academiaId = this.authService.getUsuarioLogado()?.academiaId;

  private alunos = computed<AlunoType[]>(() => {
    if (!this.academiaId) return [];
    return this.usuarioService.listarPorAcademia(this.academiaId, 'aluno') as AlunoType[];
  });

  protected readonly filtro = signal('');
  protected readonly visao = signal<Visao>('pendentes');
  protected readonly visoes: { key: Visao; label: string }[] = [
    { key: 'pendentes', label: 'Pendentes' },
    { key: 'pagas', label: 'Pagas' },
    { key: 'todas', label: 'Todas' },
  ];
  protected readonly iniciais = iniciais;
  protected readonly tomDoAvatar = tomDoAvatar;

  private contar(status: StatusMensalidade): number {
    return this.alunos().filter((a) => calcularStatusMensalidade(a.dataDeVencimento) === status).length;
  }

  protected readonly kpis = computed<KpiData[]>(() => {
    const total = this.alunos().length;
    const receita = this.alunos().reduce((s, a) => s + (a.plano ? VALOR_POR_PLANO[a.plano] : 0), 0);
    const atrasados = this.contar('Atrasado');
    const taxa = total === 0 ? '0%' : `${((atrasados / total) * 100).toFixed(1)}%`;

    return [
      { key: 'receita', label: 'Receita mensal', icon: 'banknote', tone: 'purple', format: 'brl', value: receita, delta: null, plain: true, note: 'soma dos planos dos alunos' },
      { key: 'emdia', label: 'Alunos em dia', icon: 'checkCheck', tone: 'green', format: 'int', value: this.contar('Pago'), delta: null, plain: true, note: 'mensalidades em dia' },
      { key: 'pendentes', label: 'Pendentes', icon: 'clock', tone: 'amber', format: 'int', value: this.contar('Pendente'), delta: null, plain: true, note: 'vencem em até 7 dias' },
      { key: 'inadimplencia', label: 'Inadimplência', icon: 'alert', tone: 'red', format: 'int', value: atrasados, delta: null, plain: true, note: `${taxa} dos alunos` },
    ];
  });

  private linhas = computed<LinhaCarteira[]>(() =>
    this.alunos().map((a) => {
      const status = calcularStatusMensalidade(a.dataDeVencimento);
      return {
        id: a.id,
        nome: a.nome,
        plano: a.plano ?? '',
        valor: a.plano ? formatarValorPlano(a.plano) : 'Gratuita',
        vencimento: formatarData(a.dataDeVencimento),
        status,
        tom: TOM_STATUS[status],
      };
    }),
  );

  protected readonly linhasFiltradas = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    const v = this.visao();
    const porStatus = this.linhas().filter((l) =>
      v === 'todas' ? true : v === 'pagas' ? l.status === 'Pago' : l.status !== 'Pago',
    );
    if (!f) return porStatus;
    return porStatus.filter((l) => [l.nome, l.plano, l.valor, l.vencimento, l.status].some((x) => x.toLowerCase().includes(f)));
  });

  protected readonly tudoEmDia = computed(
    () => this.visao() === 'pendentes' && !this.filtro().trim() && !this.linhasFiltradas().length,
  );

  protected definirVisao(v: Visao): void {
    this.visao.set(v);
  }

  protected readonly semAlunos = computed(() => this.alunos().length === 0);

  protected aplicarFiltro(event: Event): void {
    this.filtro.set((event.target as HTMLInputElement).value);
  }
}
