import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType } from '../../../shared/types/usuario';
import { LABEL_POR_PLANO, VALOR_POR_PLANO } from '../../../shared/constants/plano.constants';
import { calcularStatusMensalidade, receitaDoMes } from '../../../shared/utils/mensalidade.utils';
import { addDias, dataCurta, inicioDoDia, iniciais, mesCurto, relPassado, tomDoAvatar } from '../../../shared/utils/data.utils';
import { ChartRow, EnrollmentRow, fmtBRL } from '../../../shared/utils/chart.utils';
import { Icon } from '../../../shared/components/icon/icon';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { AreaChart } from '../../../shared/components/area-chart/area-chart';
import { BarChart } from '../../../shared/components/bar-chart/bar-chart';
import { KpiCard, KpiData } from '../../cards/kpi-card/kpi-card';

type Periodo = 'today' | '7d' | '30d' | 'month';

const PERIODOS: Record<Periodo, { label: string; compare: string }> = {
  today: { label: 'Hoje', compare: 'vs ontem' },
  '7d': { label: '7 dias', compare: 'vs 7 dias anteriores' },
  '30d': { label: '30 dias', compare: 'vs 30 dias anteriores' },
  month: { label: 'Este mês', compare: 'vs mês passado' },
};

interface LinhaAluno {
  id: string;
  nome: string;
  plano: string;
  cadastro: string;
  statusTom: string;
  statusTexto: string;
}

interface LinhaPagamento {
  id: string;
  nome: string;
  plano: string;
  vencimento: string;
  valor: number;
  tom: string;
  situacao: string;
}

@Component({
  selector: 'app-proprietario',
  imports: [RouterLink, Icon, EmptyState, AreaChart, BarChart, KpiCard],
  templateUrl: './proprietario.html',
})
export class Proprietario {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  protected readonly usuarioLogado = this.authService.usuarioLogado;
  protected readonly primeiroNome = computed(() => (this.usuarioLogado()?.nome ?? '').trim().split(/\s+/)[0]);

  protected readonly periodos = (Object.keys(PERIODOS) as Periodo[]).map((key) => ({ key, label: PERIODOS[key].label }));
  protected readonly periodo = signal<Periodo>('month');
  protected readonly compare = computed(() => PERIODOS[this.periodo()].compare);

  // ---------- dados base ----------
  private alunos = computed<AlunoType[]>(() => {
    const academiaId = this.usuarioLogado()?.academiaId;
    if (!academiaId) return [];
    return this.usuarioService.listarPorAcademia(academiaId, 'aluno') as AlunoType[];
  });

  private contratacoes = computed(() =>
    this.alunos()
      .filter((a) => !!a.dataDeContratacao)
      .map((a) => ({ data: new Date(a.dataDeContratacao as string), valor: a.plano ? VALOR_POR_PLANO[a.plano] : 0 })),
  );

  private cancelamentos = computed(() => {
    const academiaId = this.usuarioLogado()?.academiaId;
    if (!academiaId) return [] as Date[];
    return this.usuarioService.listarCancelamentosPorAcademia(academiaId).map((c) => new Date(c.data));
  });

  protected readonly gymVazia = computed(() => this.alunos().length === 0);

  // ---------- período ----------
  private intervalo = computed(() => {
    const p = this.periodo();
    const hoje = inicioDoDia(new Date());
    const fim = addDias(hoje, 1);
    let ini: Date;
    let ant: Date;
    if (p === 'today') {
      ini = hoje;
      ant = addDias(hoje, -1);
    } else if (p === '7d') {
      ini = addDias(hoje, -6);
      ant = addDias(ini, -7);
    } else if (p === '30d') {
      ini = addDias(hoje, -29);
      ant = addDias(ini, -30);
    } else {
      ini = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      ant = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    }
    return { ini, fim, ant };
  });

  private static contar(datas: Date[], de: Date, ate: Date): number {
    return datas.filter((d) => d >= de && d < ate).length;
  }

  private static variacao(atual: number, anterior: number): number | null {
    return anterior > 0 ? ((atual - anterior) / anterior) * 100 : null;
  }

  // ---------- últimos 6 meses ----------
  private meses = computed(() => {
    const hoje = new Date();
    return [-5, -4, -3, -2, -1, 0].map((off) => {
      const ini = new Date(hoje.getFullYear(), hoje.getMonth() + off, 1);
      const fim = new Date(hoje.getFullYear(), hoje.getMonth() + off + 1, 1);
      return { label: mesCurto(ini), ini, fim };
    });
  });

  protected readonly historicoReceita = computed<ChartRow[]>(() =>
    this.meses().map((m) => ({
      label: m.label,
      value: this.contratacoes()
        .filter((c) => c.data >= m.ini && c.data < m.fim)
        .reduce((s, c) => s + c.valor, 0),
    })),
  );

  protected readonly matriculas = computed<EnrollmentRow[]>(() =>
    this.meses().map((m) => ({
      label: m.label,
      enrollments: Proprietario.contar(this.contratacoes().map((c) => c.data), m.ini, m.fim),
      cancellations: Proprietario.contar(this.cancelamentos(), m.ini, m.fim),
    })),
  );

  protected readonly receitaVazia = computed(() => this.historicoReceita().every((r) => !r.value));
  protected readonly matriculasVazias = computed(() =>
    this.matriculas().every((r) => !r.enrollments && !r.cancellations),
  );

  // ---------- KPIs ----------
  protected readonly kpis = computed<KpiData[]>(() => {
    const { ini, fim, ant } = this.intervalo();
    const alunos = this.alunos();
    const datasContrato = this.contratacoes().map((c) => c.data);
    const cancel = this.cancelamentos();

    const ativos = alunos.length;
    const emDia = alunos.filter((a) => calcularStatusMensalidade(a.dataDeVencimento) === 'Pago').length;
    const receita = receitaDoMes(alunos);

    const novos = Proprietario.contar(datasContrato, ini, fim);
    const novosAnt = Proprietario.contar(datasContrato, ant, ini);
    const canceladas = Proprietario.contar(cancel, ini, fim);
    const canceladasAnt = Proprietario.contar(cancel, ant, ini);
    const total = ativos + canceladas;
    const taxa = total === 0 ? 0 : (canceladas / total) * 100;

    return [
      {
        key: 'revenue', label: 'Receita no mês', icon: 'banknote', tone: 'purple', format: 'brl',
        value: receita, delta: null, featured: true, plain: true,
        note: 'Mensalidades pagas neste mês',
      },
      { key: 'active', label: 'Alunos ativos', icon: 'users', tone: 'blue', format: 'int', value: ativos, delta: null },
      {
        key: 'new', label: 'Novos alunos', icon: 'userPlus', tone: 'blue', format: 'int',
        value: novos, delta: Proprietario.variacao(novos, novosAnt),
        series: this.matriculas().map((r) => r.enrollments),
      },
      { key: 'ontime', label: 'Pagamentos em dia', icon: 'checkCheck', tone: 'green', format: 'int', value: emDia, delta: null },
      {
        key: 'canceled', label: 'Matrículas canceladas', icon: 'userX', tone: 'red', format: 'int',
        value: canceladas, delta: Proprietario.variacao(canceladas, canceladasAnt), inverse: true,
        zeroText: 'Nenhum cancelamento no período',
        series: this.matriculas().map((r) => r.cancellations),
      },
      {
        key: 'rate', label: 'Taxa de cancelamento', icon: 'percent', tone: 'red', format: 'pct',
        value: taxa, delta: null, inverse: true, zeroText: 'Sem cancelamentos no período',
      },
    ];
  });

  // ---------- tabelas ----------
  protected readonly ultimosAlunos = computed<LinhaAluno[]>(() =>
    this.alunos()
      .filter((a) => !!a.dataDeContratacao)
      .sort((a, b) => new Date(b.dataDeContratacao as string).getTime() - new Date(a.dataDeContratacao as string).getTime())
      .slice(0, 5)
      .map((a) => {
        let statusTom = 'green';
        let statusTexto = 'Ativo';
        if (a.plano === 'experimental') {
          statusTom = 'blue';
          statusTexto = 'Experimental';
        } else {
          const s = calcularStatusMensalidade(a.dataDeVencimento);
          if (s === 'Pendente') [statusTom, statusTexto] = ['amber', 'Pendente'];
          if (s === 'Atrasado') [statusTom, statusTexto] = ['red', 'Atrasado'];
        }
        return {
          id: a.id,
          nome: a.nome,
          plano: a.plano ? LABEL_POR_PLANO[a.plano] : 'Sem plano',
          cadastro: relPassado(a.dataDeContratacao),
          statusTom,
          statusTexto,
        };
      }),
  );

  protected readonly pagamentos = computed<LinhaPagamento[]>(() => {
    const dias = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5);
    return this.alunos()
      .filter((a) => !!a.dataDeVencimento && calcularStatusMensalidade(a.dataDeVencimento) !== 'Pago')
      .sort((a, b) => new Date(a.dataDeVencimento as string).getTime() - new Date(b.dataDeVencimento as string).getTime())
      .slice(0, 5)
      .map((a) => {
        const d = dias(a.dataDeVencimento as string);
        const atrasado = calcularStatusMensalidade(a.dataDeVencimento) === 'Atrasado';
        const n = Math.max(1, -d);
        return {
          id: a.id,
          nome: a.nome,
          plano: a.plano ? LABEL_POR_PLANO[a.plano] : 'Sem plano',
          vencimento: dataCurta(a.dataDeVencimento),
          valor: a.plano ? VALOR_POR_PLANO[a.plano] : 0,
          tom: atrasado ? 'red' : 'amber',
          situacao: atrasado
            ? `Atrasado · ${n} ${n === 1 ? 'dia' : 'dias'}`
            : d <= 0 ? 'Vence hoje' : d === 1 ? 'Vence amanhã' : `Vence em ${d} dias`,
        };
      });
  });

  protected readonly fmtBRL = fmtBRL;
  protected readonly iniciais = iniciais;
  protected readonly tomDoAvatar = tomDoAvatar;

  protected definirPeriodo(p: Periodo): void {
    this.periodo.set(p);
  }
}
