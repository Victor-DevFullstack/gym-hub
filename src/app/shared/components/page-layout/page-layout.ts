import { Component, inject } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';

import { Proprietario } from '../../../features/dashboard/proprietario/proprietario';
import { Recepcao } from '../../../features/dashboard/recepcao/recepcao';
import { Professor } from '../../../features/dashboard/professor/professor';
import { Aluno } from '../../../features/dashboard/aluno/aluno';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-page-layout',
  imports: [Sidebar, Header, RouterOutlet, Proprietario, Recepcao, Professor, Aluno],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.css',
})
export class PageLayout {
  private authService = inject(AuthService);
  usuarioLogado = this.authService.getUsuarioLogado();
}