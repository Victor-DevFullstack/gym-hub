import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Role, UsuarioType } from '../../../shared/types/usuario';
import { TitleCasePipe } from '@angular/common';
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

const ELEMENT_DATA: Test[] = [
  { name: 'Marcia', cargo: 'recepcionista', email: 'hydrogen@example.com', status: 'Ativo' },
  { name: 'Wellington', cargo: 'recepcionista', email: 'helium@example.com', status: 'Ativo' },
  { name: 'Lívia', cargo: 'recepcionista', email: 'Li', status: 'Ativo' },
  { name: 'Ana', cargo: 'recepcionista', email: 'Be', status: 'Ativo' },
  { name: 'Carlos', cargo: 'recepcionista', email: 'B', status: 'Ativo' },
  { name: 'Maria', cargo: 'recepcionista', email: 'C', status: 'Ativo' },
  { name: 'Olivia', cargo: 'recepcionista', email: 'N', status: 'Ativo' },
];

@Component({
  selector: 'app-funcionarios',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, TitleCasePipe],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios {
  displayedColumns: string[] = ['nome', 'role', 'email', 'editar'];

  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);
  
  private recepcionistas = computed(() => this.usuarioService.listarPorCargo('recepcionista'));

  dataSource = new MatTableDataSource<UsuarioType>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.recepcionistas();
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

      const novoRecepcionista: UsuarioType = {
        id: usuario ? usuario.id : crypto.randomUUID(),
        nome: resultado.nome,
        email: resultado.email,
        senha: resultado.senha,
        role: resultado.cargo,
        academiaId: usuarioLogado.academiaId,
        nomeAcademia: usuarioLogado.nomeAcademia,
      };

      if (usuario) {
        let { cadastrou, message } = this.usuarioService.atualizar(novoRecepcionista);
        if (!cadastrou) {
          this.dialog.openDialog({ title: 'Erro ao atualizar', message });
          return;
        }
      } else {
        let { cadastrou, message } = this.usuarioService.cadastrar(novoRecepcionista);
        if (!cadastrou) {
          this.dialog.openDialog({ title: 'Erro no cadastro', message });
          return;
        }
      }

      this.dataSource.data = [...this.dataSource.data];
    });
  }
}
