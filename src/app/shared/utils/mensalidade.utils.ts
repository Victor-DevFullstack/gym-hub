import { AlunoType } from '../types/usuario';
import { DIAS_POR_PLANO, VALOR_POR_PLANO } from '../constants/plano.constants';

export type StatusMensalidade = 'Pago' | 'Pendente' | 'Atrasado';

const DIAS_LIMITE_PENDENTE = 7;

export function calcularStatusMensalidade(dataDeVencimento: string | null): StatusMensalidade {
  if (!dataDeVencimento) {
    return 'Pago';
  }

  const hoje = new Date();
  const vencimento = new Date(dataDeVencimento);
  const diasParaVencer = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  if (diasParaVencer < 0) {
    return 'Atrasado';
  }
  if (diasParaVencer <= DIAS_LIMITE_PENDENTE) {
    return 'Pendente';
  }
  return 'Pago';
}

export function formatarData(data: string | null): string {
  return data ? new Date(data).toLocaleDateString('pt-BR') : '-';
}

/**
 * Uma mensalidade conta como "paga no mês" quando o aluno está com a situação "Pago"
 * e o ciclo atual do plano começou no mês corrente (vencimento menos a duração do plano).
 * O projeto ainda não guarda a data de cada pagamento, então esta é a melhor aproximação possível.
 */
export function pagaNoMes(aluno: AlunoType, referencia: Date = new Date()): boolean {
  if (!aluno.plano || !aluno.dataDeVencimento) return false;
  if (calcularStatusMensalidade(aluno.dataDeVencimento) !== 'Pago') return false;

  const inicioDoCiclo = new Date(aluno.dataDeVencimento);
  inicioDoCiclo.setDate(inicioDoCiclo.getDate() - DIAS_POR_PLANO[aluno.plano]);

  return (
    inicioDoCiclo.getMonth() === referencia.getMonth() &&
    inicioDoCiclo.getFullYear() === referencia.getFullYear()
  );
}

export function receitaDoMes(alunos: AlunoType[], referencia: Date = new Date()): number {
  return alunos
    .filter((a) => pagaNoMes(a, referencia))
    .reduce((soma, a) => soma + (a.plano ? VALOR_POR_PLANO[a.plano] : 0), 0);
}
