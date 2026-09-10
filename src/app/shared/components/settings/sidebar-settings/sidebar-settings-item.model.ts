import { Role } from "../../../types/usuario";

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  //roles: Role[];
  class: string;
}

export const SIDEBAR_SETTINGS_ITEMS: SidebarItem[] = [
  {
    label: 'Funcionarios',
    icon: '/icons/person.svg',
    route: 'account',
    //roles: ['proprietario'],
    class: 'icons-sidebar',
  },
];