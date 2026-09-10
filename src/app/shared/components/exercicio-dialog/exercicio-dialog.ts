import { Component, inject } from '@angular/core';
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

export type ExercicioFormValue = {
  nome: string;
  series: number;
  repeticoes: number;
  carga: string;
  observacoes: string;
};

@Component({
  selector: 'app-exercicio-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './exercicio-dialog.html',
  styleUrl: './exercicio-dialog.css',
})
export class ExercicioDialog {
  private dialogRef = inject(MatDialogRef<ExercicioDialog>);

  data = inject<{ exercicio?: ExercicioType }>(MAT_DIALOG_DATA);

  titulo = this.data.exercicio ? 'Editar exercício' : 'Adicionar exercício';

  form = new FormGroup({
    nome: new FormControl(this.data.exercicio?.nome ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    series: new FormControl(this.data.exercicio?.series ?? 3, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    repeticoes: new FormControl(this.data.exercicio?.repeticoes ?? 12, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    carga: new FormControl(this.data.exercicio?.carga ?? '', { nonNullable: true }),
    observacoes: new FormControl(this.data.exercicio?.observacoes ?? '', { nonNullable: true }),
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue() as ExercicioFormValue);
  }
}
