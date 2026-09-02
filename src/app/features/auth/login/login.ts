import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Dialog } from '../../../shared/components/dialog/dialog';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  emailFormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  passwordFormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  authService = inject(AuthService);
  dialog = inject(Dialog);
  readonly router = inject(Router);

  form = new FormGroup({
    email: this.emailFormControl,
    senha: this.passwordFormControl,
  });

  login() {
    const { email, senha } = this.form.getRawValue();
    const { user } = this.authService.login(email, senha);

    if (user) {
      this.dialog
        .openDialog({
          title: 'Logado com sucesso',
          message: 'Deseja ir para a dashboard?',
          confirmDialog: true,
        })
        .subscribe((irParaDashboard) => {
          irParaDashboard && this.router.navigate(['/dashboard']);
        });
    } else {
      this.dialog.openDialog({ title: 'Falha', message: 'Email ou senha estão incorretos.' });
    }
  }
}