import { Component, inject, signal, computed} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { DashboardCard } from "../../cards/dashboard-card/dashboard-card";
import { RouterOutlet } from '@angular/router';
import { AlunoType } from '../../../shared/types/usuario';
import { calcularStatusMensalidade } from '../../../shared/utils/mensalidade.utils';


@Component({
  selector: 'app-recepcao',
  imports: [DashboardCard, RouterOutlet],
  templateUrl: './recepcao.html',
  styleUrl: './recepcao.css',
})
export class Recepcao {
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

  readonly mensalidadesPendentes = computed(
    () => this.alunos().filter((aluno) => calcularStatusMensalidade(aluno.dataDeVencimento) !== 'Pago').length,
  );

  readonly novosHoje = computed(() => {
    const hoje = new Date();
    return this.alunos().filter((aluno) => {
      if (!aluno.dataDeContratacao) {
        return false;
      }
      const dataContratacao = new Date(aluno.dataDeContratacao);
      return (
        dataContratacao.getDate() === hoje.getDate() &&
        dataContratacao.getMonth() === hoje.getMonth() &&
        dataContratacao.getFullYear() === hoje.getFullYear()
      );
    }).length;
  });
}
