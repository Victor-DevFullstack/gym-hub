import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { UsuarioService } from '../../../core/services/usuario.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { EmailReputationService } from '../../../core/services/email-reputation.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  validandoEmail = false;
  emailValidado = false;
  erroEmail = "";

  private ultimoEmailValidado = "";

  private emailReputationService = inject(EmailReputationService);

  // Controla qual página do cadastro está sendo exibida
  etapaAtual = 1;


  // =========================
  // CAMPOS DO FORMULÁRIO
  // =========================

  emailFormControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.email
    ],
  });

  passwordFormControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(8)
    ],
  });


  form = new FormGroup({

    // Página 1
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    email: this.emailFormControl,

    senha: this.passwordFormControl,


    // Página 2
    nomeAcademia: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    cnpj: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    telefone: new FormControl('', {
      nonNullable: true,
    }),

    endereco: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

  });


  // =========================
  // INJEÇÕES
  // =========================

  usuarioService = inject(UsuarioService);
  dialog = inject(Dialog);
  private router = inject(Router);


  // =========================
  // VALIDAÇÃO DA PÁGINA 1
  // =========================

  etapa1Valida(): boolean {

    return (
      this.form.controls.nome.valid &&
      this.form.controls.email.valid &&
      this.form.controls.senha.valid
    );

  }


  // =========================
  // VALIDAÇÃO DA PÁGINA 2
  // =========================

  etapa2Valida(): boolean {

    return (
      this.form.controls.nomeAcademia.valid &&
      this.form.controls.cnpj.valid &&
      this.form.controls.endereco.valid
    );

  }


  // =========================
  // IR PARA PÁGINA 2
  // =========================

  proximaEtapa(): void {

    if (this.etapa1Valida()) {
      //this.etapaAtual = 2;

      if (this.etapaAtual === 1) {

      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      this.verificarEmail();

      return;
      }

    }

  }

  // =========================
  // VOLTAR PARA PÁGINA 1
  // =========================

  voltar(): void {

    if (this.etapaAtual === 2) {
      this.etapaAtual = 1;
    }

  }


  //==========================
  //VERIFICAR EMAIL
  //==========================

  verificarEmail(): void {
    const email = this.emailFormControl.value.trim();

    //Validação do angular
    if(this.emailFormControl.invalid) {
      this.emailFormControl.markAllAsTouched();
      return;
    }

    this.validandoEmail = true;
    this.emailValidado = false;
    this.erroEmail = "";

    this.emailReputationService.verificar(email).subscribe({
      next: (resultado) => {
        this.validandoEmail = false;

        const entregavel = resultado.email_deliverability.status === 'deliverable';

        const formatoValido = resultado.email_deliverability.is_format_valid;

        const mxValido = resultado.email_deliverability.is_mx_valid;

        const smtpValido = resultado.email_deliverability.is_smtp_valid;
      
        if (entregavel && formatoValido && mxValido && smtpValido) {
          this.emailValidado = true;
          this.erroEmail = '';
        } else {
          this.emailValidado = false;
          this.erroEmail = 'Não foi possível validar este endereço de e-mail.'
        }
      },

      error: (erro) => {
        console.error('Erro na abstract API', erro);

        this.validandoEmail = false; 
        this.emailValidado = false;

        this.erroEmail = 'Não foi possível verificar o e-mail. Tente novamente.'
      }
    });
  }

  // =========================
  // CADASTRAR
  // =========================

  cadastrar(): void {

    // Não deixa cadastrar se a segunda etapa estiver inválida
    if (!this.etapa2Valida()) {
      return;
    }


    const dadosForm = this.form.getRawValue();

    const id = crypto.randomUUID();


    const { cadastrou, message } = this.usuarioService.cadastrar({

      id,

      nome: dadosForm.nome,

      email: dadosForm.email,

      senha: dadosForm.senha,

      nomeAcademia: dadosForm.nomeAcademia,

      role: 'proprietario',

      academiaId: id,

    });


    // =========================
    // ERRO
    // =========================

    if (!cadastrou) {

      this.dialog.openDialog({
        title: 'Erro no cadastro',
        message
      });

    }


    // =========================
    // SUCESSO
    // =========================

    else {

      this.dialog
        .openDialog({
          title: 'Sucesso',
          message,
          confirmDialog: true
        })
        .subscribe((irParaLogin) => {

          if (irParaLogin) {
            this.router.navigate(['/login']);
          }

        });

    }

  }

}