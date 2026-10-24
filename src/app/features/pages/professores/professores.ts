import { Icon } from '../../../shared/components/icon/icon';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { iniciais, tomDoAvatar } from '../../../shared/utils/data.utils';
import { Component, signal, inject, computed } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Role, UsuarioType } from '../../../shared/types/usuario';
import { UsuarioDialog } from '../../../shared/components/usuario-dialog/usuario-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';


@Component({
  selector: 'app-professores',
  imports: [Icon, EmptyState],
  templateUrl: './professores.html',
})
export class Professores {
  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);
  private professores = computed(() => {
    const academiaId = this.authService.getUsuarioLogado()?.academiaId;
    if (!academiaId) {
      return [];
    }
    return this.usuarioService.listarPorAcademia(academiaId, 'professor');
  });

  protected readonly filtro = signal('');
  protected readonly iniciais = iniciais;
  protected readonly tomDoAvatar = tomDoAvatar;

  protected readonly total = computed(() => this.professores().length);

  protected readonly filtrados = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    const lista = this.professores();
    if (!f) return lista;
    return lista.filter((u) => u.nome.toLowerCase().includes(f) || u.email.toLowerCase().includes(f));
  });

  applyFilter(event: Event) {
    this.filtro.set((event.target as HTMLInputElement).value);
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

    });
  }

  deletarUsuario(usuario: UsuarioType) {
    this.usuarioService.deletar(usuario);
  }
}
