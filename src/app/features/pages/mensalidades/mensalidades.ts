import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Icon } from '../../../shared/components/icon/icon';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { iniciais, tomDoAvatar, tituloCase } from '../../../shared/utils/data.utils';
import { Component, computed, inject, signal, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlunoType, Role, UsuarioType } from '../../../shared/types/usuario';
import { UsuarioDialog } from '../../../shared/components/usuario-dialog/usuario-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { formatarValorPlano } from '../../../shared/constants/plano.constants';
import { calcularStatusMensalidade, formatarData, StatusMensalidade } from '../../../shared/utils/mensalidade.utils';

const TOM_STATUS: Record<StatusMensalidade, string> = { Pago: 'green', Pendente: 'amber', Atrasado: 'red' };

@Component({
  selector: 'app-mensalidades',
  imports: [Icon, EmptyState],
  templateUrl: './mensalidades.html',
})
export class Mensalidades {
  private matDialog = inject(MatDialog);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private dialog = inject(Dialog);
  private mensalidades = computed(() => {
    const usuarioLogado = this.authService.getUsuarioLogado();
    if (!usuarioLogado) {
      return [];
    }

    const alunosDaAcademia = this.usuarioService.listarPorAcademia(usuarioLogado.academiaId, 'aluno');

    if (usuarioLogado.role === 'aluno') {
      return alunosDaAcademia.filter((aluno) => aluno.id === usuarioLogado.id);
    }

    return alunosDaAcademia.filter((aluno) => calcularStatusMensalidade((aluno as AlunoType).dataDeVencimento) !== 'Pago');
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

  protected readonly total = computed(() => this.mensalidades().length);

  private linhas = computed(() =>
    this.mensalidades().map((u) => {
      const status = this.getStatus(u);
      return {
        id: u.id,
        nome: u.nome,
        plano: (u as AlunoType).plano ? tituloCase((u as AlunoType).plano as string) : 'Sem plano',
        valor: this.getValor(u),
        vencimento: this.getVencimento(u),
        status,
        tom: TOM_STATUS[status],
      };
    }),
  );

  protected readonly filtradas = computed(() => {
    const f = this.filtro().trim().toLowerCase();
    if (!f) return this.linhas();
    return this.linhas().filter((l) => [l.nome, l.plano, l.valor, l.vencimento, l.status].some((v) => v.toLowerCase().includes(f)));
  });

  applyFilter(event: Event) {
    this.filtro.set((event.target as HTMLInputElement).value);
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
        id: usuario ? usuario.id : crypto.randomUUID(),
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

    });
  }
}
