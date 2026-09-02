export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  roles: Cargos[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Alunos',
    icon: 'group',
    route: '/alunos',
    roles: [Cargos.RECEPCIONISTA],
  },
  {
    label: 'Pagamentos',
    icon: 'payments',
    route: '/pagamentos',
    roles: [Cargos.RECEPCIONISTA, Cargos.ALUNOS],
  },
  {
    label: 'Usuários',
    icon: 'person',
    route: '/usuarios',
    roles: [Cargos.RECEPCIONISTA, Cargos.PROPRIETARIO],
  },
];
