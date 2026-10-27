import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, UsuarioType } from '../../types/usuario';
import { Icon } from '../icon/icon';

export type FuncionarioFormValue = {
  nome: string;
  email: string;
  senha: string;
  cargo: Role;
};

const SUBTITULO: Partial<Record<Role, string>> = {
  professor: 'Crie o acesso do professor ou personal.',
  recepcionista: 'Crie o acesso de um membro da recepção.',
};

@Component({
  selector: 'app-adicionar-funcionario-dialog',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './usuario-dialog.html',
  styleUrl: './usuario-dialog.css',
})
export class UsuarioDialog {
  private dialogRef = inject(MatDialogRef<UsuarioDialog>);
  data = inject<{ cargo: Role; usuario?: UsuarioType }>(MAT_DIALOG_DATA);

  titulo = computed(() => `${this.data.usuario ? 'Editar' : 'Adicionar'} ${this.data.cargo}`);
  subtitulo = computed(() => (this.data.usuario ? this.data.usuario.nome : (SUBTITULO[this.data.cargo] ?? '')));
  mostrarSenha = signal(false);

  form = new FormGroup({
    nome: new FormControl(this.data.usuario?.nome ?? '', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl(this.data.usuario?.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    senha: new FormControl(this.data.usuario?.senha ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    cargo: new FormControl<Role>(this.data.cargo, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  invalido(campo: 'nome' | 'email' | 'senha'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  fechar(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue() as FuncionarioFormValue);
  }
}
