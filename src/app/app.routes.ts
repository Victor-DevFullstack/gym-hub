import { Routes } from '@angular/router';

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
    path: 'dashboard', loadComponent: () => import('./shared/components/page-layout/page-layout').then((m) => m.PageLayout),
  }
];
