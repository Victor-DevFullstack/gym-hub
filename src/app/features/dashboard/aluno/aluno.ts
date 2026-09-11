import { Component, effect, inject, signal } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardCard } from '../../cards/dashboard-card/dashboard-card';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AlunoType } from '../../../shared/types/usuario';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-aluno',
  imports: [Header, RouterOutlet, Sidebar, MatCardModule, MatIconModule, DashboardCard, TitleCasePipe, DatePipe],
  templateUrl: './aluno.html',
  styleUrl: './aluno.css',
})
export class Aluno {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  private readonly usuarioLogado = signal(this.authService.getUsuarioLogado());

  getAlunoLogado(): AlunoType | null {
    const usuario = this.usuarioLogado();
    return usuario?.role === 'aluno' ? usuario : null;
  }

  estaPago() {
    const dataVencimento = this.getAlunoLogado()?.dataDeVencimento;

    if (!dataVencimento) {
      return 'Sem plano';
    } else {
      return new Date() > new Date(dataVencimento) ? 'Atrasado' : 'Pago';
    }
  }

  planoAtivo() {
    const dataVencimento = this.getAlunoLogado()?.dataDeVencimento;

    if (!dataVencimento) {
      return 'Sem plano';
    }

    return new Date() > new Date(dataVencimento) ? 'Plano inativo' : 'Plano ativo';
  }

  getPersonal() {
    const personal = this.getAlunoLogado()?.personal;

    if (!personal || personal === "sem-personal") {
      return "Sem personal"
    }

    const professor = this.usuarioService.buscarPorId(personal as unknown as string);
    return professor?.nome ?? "Sem personal"
  }

  constructor() {
    effect(() => {
      console.log(this.usuarioLogado());
    });
  }
}
