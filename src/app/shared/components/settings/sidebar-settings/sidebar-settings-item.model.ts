import { IconName } from '../../icon/icons';

export interface SidebarItem {
  label: string;
  icon: IconName;
  route: string;
}

export const SIDEBAR_SETTINGS_ITEMS: SidebarItem[] = [
  { label: 'Conta', icon: 'user', route: 'conta' },
  { label: 'Privacidade', icon: 'lock', route: 'privacidade' },
  { label: 'Notificações', icon: 'bell', route: 'notificacoes' },
  { label: 'Faturamento', icon: 'creditCard', route: 'faturamento' },
  { label: 'Endereço', icon: 'mapPin', route: 'endereco' },
];
