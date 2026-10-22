import { Component, inject, signal } from '@angular/core';
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
  
  validandoEmail = signal(false);
  emailValidado = signal(false);
  erroEmail = signal<string | null>(null);

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

  confirmarSenhaFormControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required
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

    confirmarSenha: this.confirmarSenhaFormControl,


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

  /*etapa1Valida(): boolean {

    return (
      this.form.controls.nome.valid &&
      this.form.controls.email.valid &&
      this.form.controls.senha.valid
    );

  }*/

  etapa1Valida(): boolean {

    return (
      this.form.controls.nome.valid &&
      this.form.controls.email.valid &&
      this.form.controls.senha.valid &&
      this.form.controls.confirmarSenha.valid &&
      this.form.controls.senha.value ===
        this.form.controls.confirmarSenha.value
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

  /*proximaEtapa(): void {

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

  }*/

  proximaEtapa(): void {
    if (this.etapaAtual !== 1) {
      return;
    }

    if (!this.etapa1Valida()) {
      this.form.controls.nome.markAsTouched();
      this.emailFormControl.markAsTouched();
      this.passwordFormControl.markAsTouched();

      return;
    }

    this.verificarEmail();
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

    // Validação do Angular
    if (this.emailFormControl.invalid) {
      this.emailFormControl.markAsTouched();
      return;
    }

    this.validandoEmail.set(true);
    this.emailValidado.set(false);
    this.erroEmail.set(null);

    this.emailReputationService.verificar(email).subscribe({

      next: (resultado) => {
        console.log('RESPOSTA DA ABSTRACT:', resultado);

        this.validandoEmail.set(false);

        const entregavel = resultado.email_deliverability.status === 'deliverable';

        const formatoValido = resultado.email_deliverability.is_format_valid;

        const mxValido = resultado.email_deliverability.is_mx_valid;

        const smtpValido = resultado.email_deliverability.is_smtp_valid;

        if ( entregavel && formatoValido && mxValido && smtpValido ) {
          console.log("teste1");
          this.emailValidado.set(true);
          
          this.erroEmail.set(null);

          this.ultimoEmailValidado = email;

          // Vai para a etapa 2
          this.etapaAtual = 2;

        } else {
          
          this.emailValidado.set(false);
          
          this.erroEmail.set('Não foi possível validar este endereço de e-mail.');
          console.log("teste2");
        }
      },

      error: (erro) => {

        console.error(
          'Erro na Abstract API:',
          erro
        );

        this.validandoEmail.set(false);
        this.emailValidado.set(false);

        this.erroEmail.set('Não foi possível verificar o e-mail. Tente novamente.');
      }

    });
  }

  // =========================
  // CADASTRAR
  // =========================

  cadastrar(): void {
    if ( !this.emailValidado || this.emailFormControl.value !== this.ultimoEmailValidado ) {
      this.dialog.openDialog({
        title: 'E-mail não validado',
        message: 'Verifique seu e-mail antes de concluir o cadastro.'
      });

      this.etapaAtual = 1;

      return;
    }

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