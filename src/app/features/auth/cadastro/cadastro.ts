import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  emailFormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  passwordFormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nomeAcademia: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: this.emailFormControl,
    senha: this.passwordFormControl,
  });

  usuarioService = inject(UsuarioService);
  dialog = inject(Dialog);
  private router = inject(Router);

  cadastrar() {
    const dadosForm = this.form.getRawValue();
    const id = crypto.randomUUID();

    // Cadastro público sempre cria o usuário como "proprietario",
    // dono da própria academia (academiaId = o próprio id dele).
    const { cadastrou, message } = this.usuarioService.cadastrar({
      id,
      nome: dadosForm.nome,
      email: dadosForm.email,
      senha: dadosForm.senha,
      nomeAcademia: dadosForm.nomeAcademia,
      role: 'proprietario',
      academiaId: id,
    });

    if (!cadastrou) {
      this.dialog.openDialog({ title: 'Erro no cadastro', message });
    } else {
      this.dialog
        .openDialog({ title: 'Sucesso', message, confirmDialog: true })
        .subscribe((irParaLogin) => {
          if (irParaLogin) {
            this.router.navigate(['/']);
          }
        });
    }
  }
}