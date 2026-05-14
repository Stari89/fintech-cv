import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'print',
    loadComponent: () => import('./pages/print/print.component').then(m => m.PrintComponent)
  },
  { path: '**', redirectTo: '' }
];
