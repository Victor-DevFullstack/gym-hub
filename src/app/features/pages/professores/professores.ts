import { Component, signal, effect, inject, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Role, UsuarioType } from '../../../shared/types/usuario';
import { TitleCasePipe, NgClass } from '@angular/common';
import { UsuarioDialog } from '../../../shared/components/usuario-dialog/usuario-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';


@Component({
  selector: 'app-professores',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, TitleCasePipe, NgClass],
  templateUrl: './professores.html',
  styleUrl: './professores.css',
})
export class Professores {
  displayedColumns: string[] = ['nome', 'email', 'editar'];

  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);
  private professores = computed(() => this.usuarioService.listarPorCargo('professor'));

  dataSource = new MatTableDataSource<UsuarioType>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.professores();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirDialog(usuario?: UsuarioType): void {
    const dialogRef = this.matDialog.open(UsuarioDialog, {
      data: { cargo: 'professor', usuario },
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
        id: crypto.randomUUID(),
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

  deletarUsuario(usuario: UsuarioType) {
    console.log(usuario);

    this.usuarioService.deletar(usuario);
  }
}
