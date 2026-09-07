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
    ],
  },
];
  