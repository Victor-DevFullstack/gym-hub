import { Component, computed, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
import { Role, UsuarioType } from '../../types/usuario';

export type FuncionarioFormValue = {
  nome: string;
  email: string;
  senha: string;
  cargo: Role;
};

@Component({
  selector: 'app-adicionar-funcionario-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TitleCasePipe,
  ],
  templateUrl: './usuario-dialog.html',
  styleUrl: './usuario-dialog.css',
})
export class UsuarioDialog {
  private dialogRef = inject(MatDialogRef<UsuarioDialog>);
  data = inject<{ cargo: Role; usuario?: UsuarioType }>(MAT_DIALOG_DATA);
  // @Input() titulo = this.data.usuario ? `Adicionar ${this.data.cargo}`: `Editar ${this.data.usuario}`
  titulo = computed(() => !this.data.usuario ? `Adicionar ${this.data.cargo}`: `Editar ${this.data.usuario.nome}`)
  
  constructor() {
    console.log(this.data.usuario);
    
  }

  form = new FormGroup({
    nome: new FormControl(this.data.usuario?.nome ?? "", { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl(this.data.usuario?.email ?? "", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    senha: new FormControl(this.data.usuario?.senha ?? "", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    cargo: new FormControl<Role>(this.data.cargo, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue() as FuncionarioFormValue);
  }
}
