import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlunoType, Role, UsuarioType } from '../../../shared/types/usuario';
import { TitleCasePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioDialog } from '../../../shared/components/usuario-dialog/usuario-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';

export interface Test {
  name: string;
  cargo: Role;
  email: string;
  status: 'Ativo' | 'Inativo';
}

@Component({
  selector: 'app-professor',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, TitleCasePipe, NgClass, RouterLink],
  templateUrl: './professor.html',
  styleUrl: './professor.css',
})
export class Professor {
displayedColumns: string[] = ['nome', 'plano', 'status', 'treino', 'editar'];

  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);
  private professorLogado = this.authService.getUsuarioLogado();

  private professor = computed(() => {
    const professorLogado = this.professorLogado;
    if (!professorLogado) {
      return [];
    }

    return this.usuarioService
      .listarPorAcademia(professorLogado.academiaId, 'aluno')
      .filter((usuario): usuario is AlunoType => {
        const personal = (usuario as AlunoType).personal;
        return !!personal && personal !== 'sem-personal' && (personal as unknown as string) === professorLogado.id;
      });
  });

  dataSource = new MatTableDataSource<UsuarioType>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.professor();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirDialog(usuario?: UsuarioType): void {
    const dialogRef = this.matDialog.open(UsuarioDialog, {
      data: { cargo: 'recepcionista', usuario },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (!resultado) {
        return;
      }

      const usuarioLogado = this.authService.getUsuarioLogado();

      if (!usuarioLogado) {
        this.dialog.openDialog({
          title: 'Erro',
          message: 'Não foi possível identificar a academia do usuário logado',
        });
        return;
      }

      const novoProfessor: UsuarioType = {
        id: usuario ? usuario.id : crypto.randomUUID(),
        nome: resultado.nome,
        email: resultado.email,
        senha: resultado.senha,
        role: resultado.cargo,
        academiaId: usuarioLogado.academiaId,
        nomeAcademia: usuarioLogado.nomeAcademia,
      };

      if (usuario) {
        let { cadastrou, message } = this.usuarioService.atualizar(novoProfessor);
        if (!cadastrou) {
          this.dialog.openDialog({ title: 'Erro ao atualizar', message });
          return;
        }
      } else {
        let { cadastrou, message } = this.usuarioService.cadastrar(novoProfessor);
        if (!cadastrou) {
          this.dialog.openDialog({ title: 'Erro no cadastro', message });
          return;
        }
      }

      this.dataSource.data = [...this.dataSource.data];
    });
  }
}


