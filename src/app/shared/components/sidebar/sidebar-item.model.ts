import { Role } from '../../types/usuario';

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  roles: Role[];
  class: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: 'Alunos',
    icon: '/icons/people.svg',
    route: '/alunos',
    roles: ['recepcionista'],
    class: 'icons-sidebar',
  },
  {
    label: 'Pagamentos',
    icon: 'payments',
    route: '/pagamentos',
    roles: ['recepcionista', 'cliente'],
    class: 'icons-sidebar',
  },
  {
    label: 'Funcionarios',
    icon: '/icons/person.svg',
    route: '/usuarios',
    roles: ['recepcionista', 'proprietario'],
    class: 'icons-sidebar',
  },
  {
    label: 'Carteira',
    icon: '/icons/wallet.svg',
    route: '/carteira',
    roles: ['proprietario'],
    class: 'icons-sidebar',
  },
];
