import { Routes } from '@angular/router';

import { DashboardComponent } from './features/templates/dashboard/dashboard.component';
import { TemplateFormComponent } from './features/templates/template-form/template-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'templates', pathMatch: 'full' },
  { path: 'templates/new', component: TemplateFormComponent },
  { path: 'templates/:id/edit', component: TemplateFormComponent },
  { path: 'templates', component: DashboardComponent },
];
