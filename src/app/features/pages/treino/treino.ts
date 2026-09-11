import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { TreinoService } from '../../../core/services/treino.service';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { ExercicioDialog, ExercicioFormValue } from '../../../shared/components/exercicio-dialog/exercicio-dialog';
import { AlunoType } from '../../../shared/types/usuario';

@Component({
  selector: 'app-treino',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './treino.html',
  styleUrl: './treino.css',
})
export class Treino {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private treinoService = inject(TreinoService);
  private matDialog = inject(MatDialog);
  private dialog = inject(Dialog);

  private usuarioLogado = this.authService.getUsuarioLogado();
  private alunoIdRota = this.route.snapshot.paramMap.get('alunoId');

  readonly modoProfessor = this.usuarioLogado?.role === 'professor' && !!this.alunoIdRota;

  readonly alunoId = this.modoProfessor ? this.alunoIdRota! : (this.usuarioLogado?.id ?? '');

  readonly aluno: AlunoType | null = (() => {
    const usuario = this.usuarioService.buscarPorId(this.alunoId);
    return usuario?.role === 'aluno' ? usuario : null;
  })();

  treinos = signal<TreinoType[]>(this.treinoService.listarPorAluno(this.alunoId));

  novoTreinoNome = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  private recarregar(): void {
    this.treinos.set(this.treinoService.listarPorAluno(this.alunoId));
  }

  criarTreino(): void {
    if (this.novoTreinoNome.invalid || !this.usuarioLogado || !this.aluno) {
      this.novoTreinoNome.markAsTouched();
      return;
    }

    this.treinoService.cadastrar({
      id: crypto.randomUUID(),
      nome: this.novoTreinoNome.value,
      alunoId: this.aluno.id,
      professorId: this.usuarioLogado.id,
      academiaId: this.usuarioLogado.academiaId,
      exercicios: [],
      atualizadoEm: new Date().toISOString(),
    });

    this.novoTreinoNome.reset('');
    this.recarregar();
  }

  excluirTreino(treinoId: string): void {
    this.dialog
      .openDialog({
        title: 'Excluir treino',
        message: 'Deseja realmente excluir esta ficha de treino?',
        confirmDialog: true,
      })
      .subscribe((confirmado) => {
        if (!confirmado) {
          return;
        }

        const treino = this.treinoService.buscarPorId(treinoId);
        if (treino) {
          this.treinoService.deletar(treino);
          this.recarregar();
        }
      });
  }

  adicionarExercicio(treinoId: string): void {
    const dialogRef = this.matDialog.open(ExercicioDialog, { data: {} });

    dialogRef.afterClosed().subscribe((resultado?: ExercicioFormValue) => {
      if (!resultado) {
        return;
      }

      const treino = this.treinoService.buscarPorId(treinoId);
      if (!treino) {
        return;
      }

      const exercicio: ExercicioType = { id: crypto.randomUUID(), ...resultado };

      this.treinoService.atualizar({
        ...treino,
        exercicios: [...treino.exercicios, exercicio],
        atualizadoEm: new Date().toISOString(),
      });

      this.recarregar();
    });
  }

  editarExercicio(treinoId: string, exercicioId: string): void {
    const treino = this.treinoService.buscarPorId(treinoId);
    const exercicio = treino?.exercicios.find((e) => e.id === exercicioId);

    if (!treino || !exercicio) {
      return;
    }

    const dialogRef = this.matDialog.open(ExercicioDialog, { data: { exercicio } });

    dialogRef.afterClosed().subscribe((resultado?: ExercicioFormValue) => {
      if (!resultado) {
        return;
      }

      this.treinoService.atualizar({
        ...treino,
        exercicios: treino.exercicios.map((e) => (e.id === exercicioId ? { ...e, ...resultado } : e)),
        atualizadoEm: new Date().toISOString(),
      });

      this.recarregar();
    });
  }

  excluirExercicio(treinoId: string, exercicioId: string): void {
    const treino = this.treinoService.buscarPorId(treinoId);
    if (!treino) {
      return;
    }

    this.treinoService.atualizar({
      ...treino,
      exercicios: treino.exercicios.filter((e) => e.id !== exercicioId),
      atualizadoEm: new Date().toISOString(),
    });

    this.recarregar();
  }
}
