import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Dialog } from '../../dialog/dialog';
import { iniciais } from '../../../utils/data.utils';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);

  protected usuario = this.authService.usuarioLogado;
  protected iniciaisUsuario = computed(() => iniciais(this.usuario()?.nome ?? '?'));
  protected salvo = signal(false);

  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor() {
    // Sempre que o usuarioLogado (signal) mudar, o formulário se atualiza sozinho.
    effect(() => {
      const usuario = this.authService.usuarioLogado();
      this.form.patchValue(
        {
          nome: usuario?.nome ?? '',
          email: usuario?.email ?? '',
        },
        { emitEvent: false },
      );
    });
  }

  salvar() {
    const usuarioLogado = this.authService.usuarioLogado();

    if (this.form.invalid || !usuarioLogado) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, email } = this.form.getRawValue();
    const usuarioAtualizado = { ...usuarioLogado, nome, email };

    const { cadastrou, message } = this.usuarioService.atualizar(usuarioAtualizado);

    if (!cadastrou) {
      this.dialog.openDialog({ title: 'Erro ao salvar', message });
      return;
    }

    this.authService.usuarioLogado.set(usuarioAtualizado);
    this.form.markAsPristine();
    this.salvo.set(true);
  }
}
