import { Component, computed, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
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
import { Plano, ProfessorType, Role, UsuarioType } from '../../types/usuario';
import { UsuarioService } from '../../../core/services/usuario.service';

export type AddAlunoFormValue = {
  nome: string;
  email: string;
  senha: string;
  plano: Plano;
  personal: ProfessorType
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
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TitleCasePipe,
  ],
  templateUrl: './add-aluno-dialog.html',
  styleUrl: './add-aluno-dialog.css',
})
export class AddAlunoDialog {
  private dialogRef = inject(MatDialogRef<AddAlunoDialog>);

  private usuariosService = inject(UsuarioService)


  data = inject<{ cargo: Role; usuario?: UsuarioType }>(MAT_DIALOG_DATA);
  titulo = computed(() =>
    !this.data.usuario ? `Adicionar ${this.data.cargo}` : `Editar ${this.data.usuario.nome}`,
  );

  listarPersonais() {
    return this.usuariosService.listarPorCargo("professor")
  }

  constructor() {
    console.log(this.data.usuario);
  }

  usuario = this.data.usuario?.role === "aluno" ? this.data.usuario : null

  form = new FormGroup({
    nome: new FormControl(this.usuario?.nome ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl(this.usuario?.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    plano: new FormControl(this.usuario?.plano ?? '', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    personal: new FormControl(this.usuario?.personal ?? ''),
    senha: new FormControl(this.usuario?.senha ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    cargo: new FormControl<Role>(this.data.cargo, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  salvar(): void {
    console.log(this.form.value);
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue() as AddAlunoFormValue);
  }
}
