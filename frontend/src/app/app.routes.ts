import { Routes } from '@angular/router';

import { DashboardComponent } from './features/templates/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'templates', pathMatch: 'full' },
  { path: 'templates', component: DashboardComponent },
];
