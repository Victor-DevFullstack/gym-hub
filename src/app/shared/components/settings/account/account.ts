import { Component, inject } from '@angular/core';
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

  private usuarioLogado = this.authService.getUsuarioLogado();

  form = new FormGroup({
    nome: new FormControl(this.usuarioLogado?.nome ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl(this.usuarioLogado?.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  salvar() {
    if (this.form.invalid || !this.usuarioLogado) {
      return;
    }

    const { nome, email } = this.form.getRawValue();

    const usuarioAtualizado = { ...this.usuarioLogado, nome, email };

    const { cadastrou, message } = this.usuarioService.atualizar(usuarioAtualizado);

    if (!cadastrou) {
      this.dialog.openDialog({ title: 'Erro ao salvar', message });
      return;
    }

    this.authService.usuarioLogado.set(usuarioAtualizado);
    this.dialog.openDialog({ title: 'Sucesso', message: 'Dados atualizados com sucesso.' });
  }
}