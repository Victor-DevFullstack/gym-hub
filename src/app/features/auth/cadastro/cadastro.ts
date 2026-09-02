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

import { ProprietarioService } from '../../../core/services/proprietario.service';
import { ProprietarioFormControls } from '../../../shared/types/proprietario';
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

  form = new FormGroup<ProprietarioFormControls>({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nomeAcademia: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: this.emailFormControl,
    senha: this.passwordFormControl,
  });

  proprietarioService = inject(ProprietarioService);
  dialog = inject(Dialog);
  private router = inject(Router);

  cadastrar() {
    const { cadastrou, message } = this.proprietarioService.cadastrar(this.form.getRawValue());

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
