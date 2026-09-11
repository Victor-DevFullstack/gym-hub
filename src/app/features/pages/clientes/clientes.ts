import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlunoType, ProfessorType, Role, UsuarioType } from '../../../shared/types/usuario';
import { TitleCasePipe } from '@angular/common';
import { UsuarioDialog } from '../../../shared/components/usuario-dialog/usuario-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { AddAlunoDialog } from '../../../shared/components/add-aluno-dialog/add-aluno-dialog';
import { DIAS_POR_PLANO } from '../../../shared/constants/plano.constants';

@Component({
  selector: 'app-clientes',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, TitleCasePipe],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  displayedColumns: string[] = ['nome', 'email', 'plano', 'personal', 'status', 'editar'];

  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);

  private alunos = computed(() => this.usuarioService.listarPorCargo('aluno'));
  private personais = computed(() => this.usuarioService.listarPorCargo('professor'));

  dataSource = new MatTableDataSource<UsuarioType>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.alunos();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirDialog(usuario?: UsuarioType): void {
    const dialogRef = this.matDialog.open(AddAlunoDialog, {
      data: { cargo: 'aluno', usuario },
    });

    dialogRef.afterClosed().subscribe((resultado: AlunoType) => {
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

      const usuarioExistente = usuario as AlunoType | undefined;

      const dataDeContratacao = usuarioExistente?.dataDeContratacao ?? new Date().toString();

      let dataDeVencimento = usuarioExistente?.dataDeVencimento ?? null;

      if (!usuarioExistente) {
        const vencimento = new Date(dataDeContratacao);
        const dias = resultado.plano ? DIAS_POR_PLANO[resultado.plano] : DIAS_POR_PLANO.mensal;
        vencimento.setDate(vencimento.getDate() + dias);
        dataDeVencimento = vencimento.toString();
      }

      const novoAluno: AlunoType = {
        id: usuarioExistente?.id ?? crypto.randomUUID(),
        nome: resultado.nome,
        email: resultado.email,
        senha: resultado.senha,
        plano: resultado.plano,

        dataDeContratacao,
        dataDeVencimento,
        personal: resultado.personal,

        role: "aluno",
        academiaId: usuarioLogado.academiaId,
        nomeAcademia: usuarioLogado.nomeAcademia,
      };


      if (usuario) {
        let { cadastrou, message } = this.usuarioService.atualizar(novoAluno);
        if (!cadastrou) {
          this.dialog.openDialog({ title: 'Erro ao atualizar', message });
          return;
        }
      } else {
        let { cadastrou, message } = this.usuarioService.cadastrar(novoAluno);
        if (!cadastrou) {
          this.dialog.openDialog({ title: 'Erro no cadastro', message });
          return;
        }
      }

      this.dataSource.data = [...this.dataSource.data];
    });
  }

  getPersonal(personalId: string): ProfessorType | null {
    const personal: any = this.usuarioService.buscarPorId(personalId)
    if (!personal) {
      return null
    }
    return personal
  }

  deletarUsuario(usuario: UsuarioType) {
    console.log(usuario);

    this.usuarioService.deletar(usuario);
  }
}
