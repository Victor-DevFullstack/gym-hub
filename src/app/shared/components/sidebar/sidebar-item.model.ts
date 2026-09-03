import { Role } from '../../types/usuario';

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  roles: Role[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Alunos',
    icon: 'group',
    route: '/alunos',
    roles: ['recepcionista'],
  },
  {
    label: 'Pagamentos',
    icon: 'payments',
    route: '/pagamentos',
    roles: ['recepcionista', 'cliente'],
  },
  {
    label: 'Usuários',
    icon: 'person',
    route: '/usuarios',
    roles: ['recepcionista', 'proprietario'],
  },
  {
    label: 'Carteira',
    icon: 'account_balance_wallet',
    route: '/usuarios',
    roles: ['proprietario'],
  },
];
