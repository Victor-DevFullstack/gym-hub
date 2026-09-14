import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Dialog } from '../../dialog/dialog';

@Component({
  selector: 'app-account',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);

  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor() {
    // Sempre que o usuarioLogado (signal) mudar — seja por esse mesmo
    // componente salvando, seja por qualquer outro lugar do app — o
    // formulário se atualiza sozinho, sem precisar recarregar a página.
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
    //this.dialog.openDialog({ title: 'Sucesso', message: 'Dados atualizados com sucesso.' });
  }
}