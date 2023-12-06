import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tooltip', pathMatch: 'full' },
  {
    path: 'tooltip',
    loadComponent: () =>
      import('./tooltip-demo/tooltip-demo.component').then(
        (c) => c.TooltipDemoComponent
      ),
  },
];
