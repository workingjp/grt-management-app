import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';

import { Template } from '../../../models/template.model';
import { TemplateService } from '../../../services/template.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly templateService = inject(TemplateService);
  private readonly dialog = inject(Dialog);
  private readonly router = inject(Router);

  readonly templates = signal<Template[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTemplates();
  }

  onCreateTemplate(): void {
    void this.router.navigate(['/templates', 'create']);
  }

  onEditTemplate(template: Template): void {
    void this.router.navigate(['/templates', template.id, 'edit']);
  }

  onDeleteTemplate(template: Template): void {
    const dialogRef = this.dialog.open<boolean, ConfirmDialogData>(ConfirmDialogComponent, {
      data: {
        title: 'Delete Template',
        message: `Are you sure you want to delete "${template.name}"? This will also remove all related template accounts and mappings.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
      },
    });

    dialogRef.closed
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => this.templateService.deleteTemplate(template.id))
      )
      .subscribe({
        next: () => this.loadTemplates(),
        error: () => this.error.set('Failed to delete template. Please try again.'),
      });
  }

  private loadTemplates(): void {
    this.loading.set(true);
    this.error.set(null);

    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        this.templates.set(templates);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load templates. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
