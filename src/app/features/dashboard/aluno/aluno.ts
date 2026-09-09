import { Component, computed, inject, signal } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardCard } from '../../cards/dashboard-card/dashboard-card';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-aluno',
  imports: [Header, RouterOutlet, Sidebar, MatCardModule, MatIconModule, DashboardCard],
  templateUrl: './aluno.html',
  styleUrl: './aluno.css',
})
export class Aluno {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  readonly usuarioLogado = signal(this.authService.getUsuarioLogado());

  readonly alunosAtivos = computed(() => this.usuarioService.listarPorCargo('aluno').length);
}
