import { Component, inject, signal } from '@angular/core';

import { Dialog } from '../../dialog/dialog';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'app-privacidade',
  imports: [Icon],
  templateUrl: './privacidade.html',
  styleUrl: './privacidade.css',
})
export class Privacidade {
  private dialog = inject(Dialog);

  // TODO: esses dois toggles ainda não persistem — precisam de campos novos
  // no UsuarioType (ex: autenticacaoDoisFatores, compartilhamentoDeDados)
  // e de um método no UsuarioService pra salvar essas preferências.
  autenticacaoDoisFatores = signal(false);
  compartilhamentoDeDados = signal(false);

  abrirEmBreve(titulo: string) {
    this.dialog.openDialog({
      title: titulo,
      message: 'Essa funcionalidade ainda será implementada.',
    });
  }
}
