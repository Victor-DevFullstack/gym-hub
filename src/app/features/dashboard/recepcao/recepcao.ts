import { Component, inject, signal, computed} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { DashboardCard } from "../../cards/dashboard-card/dashboard-card";
import { RouterOutlet } from '@angular/router';


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

  readonly alunosAtivos = computed(() => this.usuarioService.listarPorCargo('aluno').length);
}
