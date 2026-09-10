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
    route: '/dashboard/funcionarios',
    //roles: ['proprietario'],
    class: 'icons-sidebar',
  },
  {
    label: 'Carteira',
    icon: '/icons/wallet.svg',
    route: '/dashboard/carteira',
    //roles: ['proprietario'],
    class: 'icons-sidebar',
  },
  {
    label: 'Alunos',
    icon: '/icons/people.svg',
    route: 'alunos',
    //roles: ['recepcionista'],
    class: 'icons-sidebar',
  },
  {
    label: 'Professores e Personais',
    icon: '/icons/person-arms-up.svg',
    route: 'professores',
    //roles: ['recepcionista'],
    class: 'icons-sidebar',
  },
  {
    label: 'Mensalidades',
    icon: '/icons/wallet.svg',
    route: 'mensalidades',
    //roles: ['recepcionista'],
    class: 'icons-sidebar',
  },
  {
    label: 'Treino',
    icon: '/icons/peso2.svg',
    route: 'mensalidades',
    //roles: ['aluno'],
    class: 'icons-sidebar',
  },
  {
    label: 'Pagamentos',
    icon: '/icons/wallet.svg',
    route: 'mensalidades',
    //roles: ['aluno'],
    class: 'icons-sidebar',
  },
  {
    label: 'Meu plano',
    icon: '/icons/wallet.svg',
    route: 'mensalidades',
    //roles: ['aluno'],
    class: 'icons-sidebar',
  },
  {
    label: 'Meu plano',
    icon: '/icons/wallet.svg',
    route: 'mensalidades',
    //roles: ['aluno'],
    class: 'icons-sidebar',
  },
  {
    label: 'Meu plano',
    icon: '/icons/wallet.svg',
    route: 'mensalidades',
    //roles: ['aluno'],
    class: 'icons-sidebar',
  },
  {
    label: 'Meu plano',
    icon: '/icons/wallet.svg',
    route: 'mensalidades',
    //roles: ['aluno'],
    class: 'icons-sidebar',
  },
];