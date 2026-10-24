import { Role } from '../../types/usuario';
import { IconName } from '../icon/icons';

export interface SidebarItem {
  label: string;
  icon: IconName;
  route: string;
  roles: Role[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Recepcionistas', icon: 'user', route: '/dashboard/funcionarios', roles: ['proprietario'] },
  { label: 'Carteira', icon: 'wallet', route: '/dashboard/carteira', roles: ['proprietario'] },
  { label: 'Alunos', icon: 'users', route: 'alunos', roles: ['recepcionista'] },
  { label: 'Professores e Personais', icon: 'dumbbell', route: 'professores', roles: ['recepcionista'] },
  { label: 'Mensalidades', icon: 'wallet', route: 'mensalidades', roles: ['recepcionista'] },
  { label: 'Treino', icon: 'dumbbell', route: 'treino', roles: ['aluno'] },
  { label: 'Pagamentos', icon: 'wallet', route: 'mensalidades', roles: ['aluno'] },
  { label: 'Meu plano', icon: 'creditCard', route: 'meu-plano', roles: ['aluno'] },
];
