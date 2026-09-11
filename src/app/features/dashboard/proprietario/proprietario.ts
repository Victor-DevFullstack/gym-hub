import { Component, computed, inject, signal } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardCard } from '../../cards/dashboard-card/dashboard-card';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType } from '../../../shared/types/usuario';
import { VALOR_POR_PLANO } from '../../../shared/constants/plano.constants';
import { calcularStatusMensalidade } from '../../../shared/utils/mensalidade.utils';

@Component({
  selector: 'app-proprietario',
  imports: [Header, RouterOutlet, Sidebar, MatCardModule, MatIconModule, DashboardCard],
  templateUrl: './proprietario.html',
  styleUrl: './proprietario.css',
})
export class Proprietario {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  readonly usuarioLogado = signal(this.authService.getUsuarioLogado());

  private alunos = computed<AlunoType[]>(() => {
    const academiaId = this.usuarioLogado()?.academiaId;
    if (!academiaId) {
      return [];
    }
    return this.usuarioService.listarPorAcademia(academiaId, 'aluno') as AlunoType[];
  });

  readonly alunosAtivos = computed(() => this.alunos().length);

  readonly alunosEmDia = computed(
    () => this.alunos().filter((aluno) => calcularStatusMensalidade(aluno.dataDeVencimento) === 'Pago').length,
  );

  readonly novosAlunos = computed(() => {
    const hoje = new Date();
    return this.alunos().filter((aluno) => {
      if (!aluno.dataDeContratacao) {
        return false;
      }
      const dataContratacao = new Date(aluno.dataDeContratacao);
      return (
        dataContratacao.getMonth() === hoje.getMonth() && dataContratacao.getFullYear() === hoje.getFullYear()
      );
    }).length;
  });

  readonly receitaMensal = computed(() => {
    const total = this.alunos().reduce(
      (soma, aluno) => soma + (aluno.plano ? VALOR_POR_PLANO[aluno.plano] : 0),
      0,
    );
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  });

  readonly matriculasCanceladas = computed(() => {
    const academiaId = this.usuarioLogado()?.academiaId;
    if (!academiaId) {
      return 0;
    }

    const hoje = new Date();
    return this.usuarioService.listarCancelamentosPorAcademia(academiaId).filter((cancelamento) => {
      const data = new Date(cancelamento.data);
      return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
    }).length;
  });

  readonly taxaDeCancelamento = computed(() => {
    const canceladas = this.matriculasCanceladas();
    const total = this.alunosAtivos() + canceladas;

    if (total === 0) {
      return '0%';
    }

    return `${((canceladas / total) * 100).toFixed(1)}%`;
  });
}