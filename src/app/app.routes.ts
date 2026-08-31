import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: "", loadComponent:() => import('./features/login/login/login').then((m) => m.Login)
}];
