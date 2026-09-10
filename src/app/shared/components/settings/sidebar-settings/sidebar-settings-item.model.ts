import { Role } from "../../../types/usuario";

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  class: string;
}

export const SIDEBAR_SETTINGS_ITEMS: SidebarItem[] = [
  {
    label: 'Conta',
    icon: '/icons/person-fill.svg',
    route: 'conta',
    class: 'icons-sidebar',
  },
  {
    label: 'Privacidade',
    icon: '/icons/lock.svg',
    route: 'privacidade',
    class: 'icons-sidebar',
  },
  {
    label: 'Notificações',
    icon: '/icons/bell-gray.svg',
    route: 'notificacoes',
    class: 'icons-sidebar',
  },
  {
    label: 'Faturamento',
    icon: '/icons/cartao.svg',
    route: 'faturamento',
    class: 'icons-sidebar',
  },
];