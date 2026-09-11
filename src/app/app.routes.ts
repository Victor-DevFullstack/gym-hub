import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/auth/cadastro/cadastro').then((m) => m.Cadastro),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/page-layout/page-layout').then((m) => m.PageLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home').then((m) => m.DashboardHome),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/pages/usuario/usuario').then((m) => m.Usuario),
      },
      {
        path: 'funcionarios',
        loadComponent: () => import('./features/pages/funcionarios/funcionarios').then((m) => m.Funcionarios),
      },
      {
        path: 'carteira',
        loadComponent: () => import('./features/pages/carteira/carteira').then((m) => m.Carteira),
      },
      {
        path: 'dashboards',
        loadComponent: () => import('./features/dashboard/aluno/aluno').then((m) => m.Aluno),
      },
      {
        path: 'alunos',
        loadComponent: () => import('./features/pages/clientes/clientes').then((m) => m.Clientes),
      },
      {
        path: 'professores',
        loadComponent: () => import('./features/pages/professores/professores').then((m) => m.Professores),
      },
      {
        path: 'mensalidades',
        loadComponent: () => import('./features/pages/mensalidades/mensalidades').then((m) => m.Mensalidades),
      },
      {
        path: 'meu-plano',
        loadComponent: () => import('./features/pages/meu-plano/meu-plano').then((m) => m.MeuPlano),
      },
      {
        path: 'treino',
        loadComponent: () => import('./features/pages/treino/treino').then((m) => m.Treino),
      },
      {
        path: 'treino/:alunoId',
        loadComponent: () => import('./features/pages/treino/treino').then((m) => m.Treino),
      },
      {
        path: 'configuracoes',
        loadComponent: () => import('./shared/components/settings/layout/layout').then((m) => m.Layout),
        children: [
          {
            path: 'conta',
            loadComponent: () => import('./shared/components/settings/account/account').then((m) => m.Account)
          },
          {
            path: 'privacidade',
            loadComponent: () => import('./shared/components/settings/privacidade/privacidade').then((m) => m.Privacidade)
          },
          {
            path: 'notificacoes',
            loadComponent: () => import('./shared/components/settings/notificacoes/notificacoes').then((m) => m.Notificacoes)
          },
          {
            path: 'faturamento',
            loadComponent: () => import('./shared/components/settings/faturamento//faturamento').then((m) => m.Faturamento)
          },

        ],
      }
    ]
  },
]