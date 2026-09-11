import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { Dialog } from '../../dialog/dialog';
import { AlunoType } from '../../../types/usuario';
import { formatarValorPlano, LABEL_POR_PLANO } from '../../../constants/plano.constants';
import { calcularStatusMensalidade, formatarData } from '../../../utils/mensalidade.utils';

interface FaturaMock {
  data: string;
  descricao: string;
  valor: string;
  status: string;
}

@Component({
  selector: 'app-faturamento',
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './faturamento.html',
  styleUrl: './faturamento.css',
})
export class Faturamento {
  private authService = inject(AuthService);
  private dialog = inject(Dialog);

  private usuarioLogado = this.authService.getUsuarioLogado();

  displayedColumns = ['data', 'descricao', 'valor', 'status'];

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

  get status() {
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