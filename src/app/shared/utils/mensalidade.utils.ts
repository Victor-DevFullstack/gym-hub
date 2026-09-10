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
