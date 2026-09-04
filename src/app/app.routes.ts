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
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent:() => import('./features/pages/usuario/usuario').then((m) => m.Usuario)
  },
  {
    path: 'carteira',
    canActivate: [authGuard],
    loadComponent: () => import('./features/pages/carteira/carteira').then((m) => m.Carteira)
  }
];
  