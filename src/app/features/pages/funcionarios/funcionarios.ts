import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, inject, signal, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioType } from '../../../shared/types/usuario';
import { Icon } from '../../../shared/components/icon/icon';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { iniciais, tomDoAvatar } from '../../../shared/utils/data.utils';
import { UsuarioDialog } from '../../../shared/components/usuario-dialog/usuario-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';

@Component({
  selector: 'app-funcionarios',
  imports: [Icon, EmptyState],
  templateUrl: './funcionarios.html',
})
export class Funcionarios {
  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);

  private recepcionistas = computed(() => {
    const academiaId = this.authService.getUsuarioLogado()?.academiaId;
    if (!academiaId) {
      return [];
    }
    return this.usuarioService.listarPorAcademia(academiaId, 'recepcionista');
  });

  protected readonly filtro = signal('');

  // Busca global do topo abre a página já filtrada (?q=...).
  private route = inject(ActivatedRoute);
  private qParam = toSignal(this.route.queryParamMap);
  private aplicaQ = effect(() => {
    const q = this.qParam()?.get('q');
    if (q !== null && q !== undefined) this.filtro.set(q);
  });
  protected readonly iniciais = iniciais;
  protected readonly tomDoAvatar = tomDoAvatar;

  protected readonly total = computed(() => this.recepcionistas().length);

  protected readonly filtrados = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    const lista = this.recepcionistas();
    if (!f) return lista;
    return lista.filter((u) => u.nome.toLowerCase().includes(f) || u.email.toLowerCase().includes(f));
  });

  applyFilter(event: Event) {
    this.filtro.set((event.target as HTMLInputElement).value);
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

    });
  }

  deletarUsuario(usuario: UsuarioType) {
    this.usuarioService.deletar(usuario);
  }
}
