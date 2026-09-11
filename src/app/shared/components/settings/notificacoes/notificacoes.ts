import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notificacoes',
  imports: [MatCardModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './notificacoes.html',
  styleUrl: './notificacoes.css',
})
export class Notificacoes {
  // TODO: mesmo caso da tela de privacidade — precisa de campos persistidos
  // no UsuarioType (ex: preferenciasNotificacao) pra isso não resetar a cada login.
  lembretesDeTreino = signal(true);
  resumoDeAtividades = signal(true);
  novasMensagens = signal(true);
  atualizacoesDoSistema = signal(false);

  silencioInicio = signal('22:00');
  silencioFim = signal('07:00');
}