import { Plano } from '../types/usuario';

type PlanoValido = Exclude<Plano, null>;

export const VALOR_POR_PLANO: Record<PlanoValido, number> = {
  experimental: 0,
  mensal: 119.9,
  trimestral: 329.7,
  semestral: 599.4,
  anual: 958.8,
};

export const LABEL_POR_PLANO: Record<PlanoValido, string> = {
  experimental: 'Aula experimental',
  mensal: 'Plano mensal',
  trimestral: 'Plano trimestral',
  semestral: 'Plano semestral',
  anual: 'Plano anual',
};

export const DIAS_POR_PLANO: Record<PlanoValido, number> = {
  experimental: 1,
  mensal: 30,
  trimestral: 90,
  semestral: 180,
  anual: 365,
};

export function formatarValorPlano(plano: PlanoValido): string {
  const valor = VALOR_POR_PLANO[plano];
  return valor === 0 ? 'Gratuita' : valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
