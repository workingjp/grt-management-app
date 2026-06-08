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
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ToastService } from '../../../shared/services/toast.service';
import { extractErrorMessage } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly templateService = inject(TemplateService);
  private readonly dialog = inject(Dialog);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly templates = signal<Template[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTemplates();
  }

  retryLoad(): void {
    this.loadTemplates();
  }

  onCreateTemplate(): void {
    void this.router.navigate(['/templates', 'new']);
  }

  onEditTemplate(template: Template): void {
    void this.router.navigate(['/templates', template.id, 'edit']);
  }

  onMapAccounts(template: Template): void {
    void this.router.navigate(['/templates', template.id, 'mapping']);
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
        switchMap(() => {
          this.deletingId.set(template.id);
          return this.templateService.deleteTemplate(template.id);
        })
      )
      .subscribe({
        next: () => {
          this.deletingId.set(null);
          this.toast.show('Template deleted successfully.');
          this.loadTemplates();
        },
        error: (err: unknown) => {
          this.deletingId.set(null);
          this.error.set(extractErrorMessage(err, 'Failed to delete template. Please try again.'));
        },
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
      error: (err: unknown) => {
        this.error.set(extractErrorMessage(err, 'Failed to load templates. Please try again.'));
        this.loading.set(false);
      },
    });
  }
}
