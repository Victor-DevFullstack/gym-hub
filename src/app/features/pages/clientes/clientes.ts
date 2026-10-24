import { Icon } from '../../../shared/components/icon/icon';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { iniciais, tomDoAvatar, tituloCase } from '../../../shared/utils/data.utils';
import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlunoType, ProfessorType, Role, UsuarioType } from '../../../shared/types/usuario';
import { UsuarioDialog } from '../../../shared/components/usuario-dialog/usuario-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { AddAlunoDialog } from '../../../shared/components/add-aluno-dialog/add-aluno-dialog';
import { DIAS_POR_PLANO } from '../../../shared/constants/plano.constants';
import { calcularStatusMensalidade, StatusMensalidade } from '../../../shared/utils/mensalidade.utils';

const TOM_STATUS: Record<StatusMensalidade, string> = { Pago: 'green', Pendente: 'amber', Atrasado: 'red' };

@Component({
  selector: 'app-clientes',
  imports: [Icon, EmptyState],
  templateUrl: './clientes.html',
})
export class Clientes {
  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);

  private alunos = computed(() => {
    const academiaId = this.authService.getUsuarioLogado()?.academiaId;
    if (!academiaId) {
      return [];
    }
    return this.usuarioService.listarPorAcademia(academiaId, 'aluno');
  });

  protected readonly filtro = signal('');
  protected readonly iniciais = iniciais;
  protected readonly tomDoAvatar = tomDoAvatar;

  protected readonly total = computed(() => this.alunos().length);

  private linhas = computed(() =>
    this.alunos().map((u) => {
      const a = u as AlunoType;
      const status = calcularStatusMensalidade(a.dataDeVencimento);
      return {
        usuario: u,
        id: u.id,
        nome: u.nome,
        email: u.email,
        plano: a.plano ? `Plano ${tituloCase(a.plano)}` : 'Sem plano',
        personal: this.getPersonal(a.personal as unknown as string)?.nome ?? 'Sem personal',
        status,
        tom: TOM_STATUS[status],
      };
    }),
  );

  protected readonly filtradas = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    if (!f) return this.linhas();
    return this.linhas().filter((l) => [l.nome, l.email, l.plano, l.personal, l.status].some((v) => v.toLowerCase().includes(f)));
  });

  applyFilter(event: Event) {
    this.filtro.set((event.target as HTMLInputElement).value);
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

    });
  }

  getStatus(usuario: UsuarioType) {
    const aluno = usuario as AlunoType;
    return calcularStatusMensalidade(aluno.dataDeVencimento);
  }

  getPersonal(personalId: string): ProfessorType | null {
    const personal: any = this.usuarioService.buscarPorId(personalId)
    if (!personal) {
      return null
    }
    return personal
  }

  deletarUsuario(usuario: UsuarioType) {
    this.usuarioService.deletar(usuario);
  }
}
