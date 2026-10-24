import { Component, inject } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';
import { Dialog } from '../../dialog/dialog';
import { Icon } from '../../icon/icon';
import { EmptyState } from '../../empty-state/empty-state';
import { AlunoType } from '../../../types/usuario';
import { formatarValorPlano, LABEL_POR_PLANO } from '../../../constants/plano.constants';
import { calcularStatusMensalidade, formatarData, StatusMensalidade } from '../../../utils/mensalidade.utils';

interface FaturaMock {
  data: string;
  descricao: string;
  valor: string;
  status: StatusMensalidade;
}

const TOM_STATUS: Record<StatusMensalidade, string> = { Pago: 'green', Pendente: 'amber', Atrasado: 'red' };

@Component({
  selector: 'app-faturamento',
  imports: [Icon, EmptyState],
  templateUrl: './faturamento.html',
  styleUrl: './faturamento.css',
})
export class Faturamento {
  private authService = inject(AuthService);
  private dialog = inject(Dialog);

  private usuarioLogado = this.authService.getUsuarioLogado();

  protected readonly tom = TOM_STATUS;

  get aluno(): AlunoType | null {
    return this.usuarioLogado?.role === 'aluno' ? this.usuarioLogado : null;
  }

  get nomePlano(): string {
    return this.aluno?.plano ? LABEL_POR_PLANO[this.aluno.plano] : 'Sem plano';
  }

  get valorPlano(): string {
    return this.aluno?.plano ? formatarValorPlano(this.aluno.plano) : '-';
  }

  get vencimento(): string {
    return formatarData(this.aluno?.dataDeVencimento ?? null);
  }

  get status(): StatusMensalidade {
    return calcularStatusMensalidade(this.aluno?.dataDeVencimento ?? null);
  }

  // TODO: histórico real depende de um serviço de mensalidades/pagamentos
  // que ainda não existe — por enquanto é só ilustrativo.
  historico: FaturaMock[] = this.aluno
    ? [{ data: this.vencimento, descricao: this.nomePlano, valor: this.valorPlano, status: this.status }]
    : [];

  atualizarPagamento() {
    this.dialog.openDialog({
      title: 'Atualizar forma de pagamento',
      message: 'Essa funcionalidade ainda será implementada.',
    });
  }
}
