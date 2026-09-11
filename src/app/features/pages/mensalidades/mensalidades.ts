import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlunoType, Role, UsuarioType } from '../../../shared/types/usuario';
import { TitleCasePipe } from '@angular/common';
import { UsuarioDialog } from '../../../shared/components/usuario-dialog/usuario-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { formatarValorPlano } from '../../../shared/constants/plano.constants';
import { calcularStatusMensalidade, formatarData } from '../../../shared/utils/mensalidade.utils';

@Component({
  selector: 'app-mensalidades',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatTableModule, TitleCasePipe],
  templateUrl: './mensalidades.html',
  styleUrl: './mensalidades.css',
})
export class Mensalidades {
  displayedColumns: string[] = ['nome', 'plano','valor', 'vencimento', 'status', ];

  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);
  private mensalidades = computed(() => this.usuarioService.listarPorCargo('aluno'));

  dataSource = new MatTableDataSource<UsuarioType>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.mensalidades();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getValor(usuario: UsuarioType): string {
    const aluno = usuario as AlunoType;
    return aluno.plano ? formatarValorPlano(aluno.plano) : 'Gratuita';
  }

  getVencimento(usuario: UsuarioType): string {
    const aluno = usuario as AlunoType;
    return formatarData(aluno.dataDeVencimento);
  }

  getStatus(usuario: UsuarioType) {
    const aluno = usuario as AlunoType;
    return calcularStatusMensalidade(aluno.dataDeVencimento);
  }

  abrirDialog(usuario?: UsuarioType): void {
    const dialogRef = this.matDialog.open(UsuarioDialog, {
      data: { cargo: 'aluno', usuario },
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

      const novoAluno: UsuarioType = {
        id: crypto.randomUUID(),
        nome: resultado.nome,
        email: resultado.email,
        senha: resultado.senha,
        role: resultado.cargo,
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
}
