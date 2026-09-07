import { Component, inject } from '@angular/core';

import { Proprietario } from '../proprietario/proprietario';
import { Recepcao } from '../recepcao/recepcao';
import { Professor } from '../professor/professor';
import { Aluno } from '../aluno/aluno';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-home',
  imports: [Proprietario, Recepcao, Professor, Aluno],
  templateUrl: './dashboard-home.html',
})
export class DashboardHome {
  private authService = inject(AuthService);
  usuarioLogado = this.authService.getUsuarioLogado();
}
