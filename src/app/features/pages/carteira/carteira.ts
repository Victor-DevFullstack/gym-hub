import { Component, computed, effect, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType, UsuarioType } from '../../../shared/types/usuario';
import { formatarValorPlano, VALOR_POR_PLANO } from '../../../shared/constants/plano.constants';
import {
  calcularStatusMensalidade,
  formatarData,
  StatusMensalidade,
} from '../../../shared/utils/mensalidade.utils';
import { DashboardCard } from '../../cards/dashboard-card/dashboard-card';

@Component({
  selector: 'app-carteira',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, TitleCasePipe, DashboardCard],
  templateUrl: './carteira.html',
  styleUrl: './carteira.css',
})
export class Carteira {
  displayedColumns: string[] = ['nome', 'plano', 'valor', 'vencimento', 'status'];

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  private proprietarioLogado = this.authService.getUsuarioLogado();

  private alunos = computed<AlunoType[]>(() => {
    const academiaId = this.proprietarioLogado?.academiaId;
    if (!academiaId) {
      return [];
    }
    return this.usuarioService.listarPorAcademia(academiaId, 'aluno') as AlunoType[];
  });

  dataSource = new MatTableDataSource<UsuarioType>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.alunos();
    });
  }

  readonly receitaMensal = computed(() => {
    const total = this.alunos().reduce(
      (soma, aluno) => soma + (aluno.plano ? VALOR_POR_PLANO[aluno.plano] : 0),
      0,
    );
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  });

  readonly totalPagos = computed(() => this.contarPorStatus('Pago'));
  readonly totalPendentes = computed(() => this.contarPorStatus('Pendente'));
  readonly totalAtrasados = computed(() => this.contarPorStatus('Atrasado'));

  readonly taxaInadimplencia = computed(() => {
    const total = this.alunos().length;
    if (total === 0) {
      return '0%';
    }
    return `${((this.totalAtrasados() / total) * 100).toFixed(1)}%`;
  });

  private contarPorStatus(status: StatusMensalidade): number {
    return this.alunos().filter((aluno) => calcularStatusMensalidade(aluno.dataDeVencimento) === status).length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getValor(usuario: UsuarioType): string {
    const aluno = usuario as AlunoType;
    return aluno.plano ? formatarValorPlano(aluno.plano) : 'Gratuita';
  }

  getVencimento(usuario: UsuarioType): string {
    return formatarData((usuario as AlunoType).dataDeVencimento);
  }

  getStatus(usuario: UsuarioType): StatusMensalidade {
    return calcularStatusMensalidade((usuario as AlunoType).dataDeVencimento);
  }
}
