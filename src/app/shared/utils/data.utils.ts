const DIA_MS = 864e5;

export const inicioDoDia = (d: Date): Date => {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
};

export const addDias = (d: Date, n: number): Date => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

/** Texto relativo para datas passadas: Hoje / Ontem / Há N dias. */
export function relPassado(iso: string | null): string {
  if (!iso) return '-';
  const n = Math.round((inicioDoDia(new Date()).getTime() - inicioDoDia(new Date(iso)).getTime()) / DIA_MS);
  return n <= 0 ? 'Hoje' : n === 1 ? 'Ontem' : `Há ${n} dias`;
}

export function dataCurta(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
}

export function mesCurto(d: Date): string {
  const s = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return s[0].toUpperCase() + s.slice(1);
}

export function iniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

const TONS_AVATAR = ['blue', 'purple', 'green', 'amber'];
export function tomDoAvatar(s: string): string {
  return TONS_AVATAR[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % TONS_AVATAR.length];
}

export function tituloCase(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
}
