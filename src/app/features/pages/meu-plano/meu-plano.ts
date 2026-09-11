import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType } from '../../../shared/types/usuario';
import { formatarValorPlano, LABEL_POR_PLANO } from '../../../shared/constants/plano.constants';
import { calcularStatusMensalidade, formatarData } from '../../../shared/utils/mensalidade.utils';
import { DashboardCard } from '../../cards/dashboard-card/dashboard-card';

@Component({
  selector: 'app-meu-plano',
  imports: [DashboardCard],
  templateUrl: './meu-plano.html',
  styleUrl: './meu-plano.css',
})
export class MeuPlano {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  private aluno = this.buscarAlunoLogado();

  private buscarAlunoLogado(): AlunoType | null {
    const usuario = this.authService.getUsuarioLogado();
    return usuario?.role === 'aluno' ? usuario : null;
  }

  get nomePlano(): string {
    return this.aluno?.plano ? LABEL_POR_PLANO[this.aluno.plano] : 'Sem plano';
  }

  get valorPlano(): string {
    return this.aluno?.plano ? formatarValorPlano(this.aluno.plano) : '-';
  }

  get vencimento(): string {
    return formatarData(this.aluno?.dataDeVencimento ?? null);
  }

  get status() {
    return calcularStatusMensalidade(this.aluno?.dataDeVencimento ?? null);
  }

  get personal(): string {
    const personal = this.aluno?.personal;
    if (!personal || personal === 'sem-personal') {
      return 'Sem personal';
    }
    const professor = this.usuarioService.buscarPorId(personal as unknown as string);
    return professor?.nome ?? 'Sem personal';
  }
}
