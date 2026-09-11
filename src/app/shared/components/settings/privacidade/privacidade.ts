import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Dialog } from '../../dialog/dialog';

@Component({
  selector: 'app-privacidade',
  imports: [MatCardModule, MatSlideToggleModule, MatListModule, MatIconModule],
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