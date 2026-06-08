import { Dialog } from '@angular/cdk/dialog';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, forkJoin, switchMap } from 'rxjs';

import { CompanyAccount } from '../../../models/company-account.model';
import { Mapping } from '../../../models/mapping.model';
import { TemplateAccount } from '../../../models/template.model';
import { CompanyAccountService } from '../../../services/company-account.service';
import { MappingService } from '../../../services/mapping.service';
import { TemplateService } from '../../../services/template.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ToastService } from '../../../shared/services/toast.service';
import { extractErrorMessage } from '../../../shared/utils/api-error.util';

@Component({
  selector: 'app-mapping',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, SpinnerComponent],
  templateUrl: './mapping.component.html',
  styleUrl: './mapping.component.css',
})
export class MappingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(Dialog);
  private readonly templateService = inject(TemplateService);
  private readonly companyAccountService = inject(CompanyAccountService);
  private readonly mappingService = inject(MappingService);
  private readonly toast = inject(ToastService);

  readonly templateId = signal('');
  readonly templateName = signal('');
  readonly templateAccounts = signal<TemplateAccount[]>([]);
  readonly companyAccounts = signal<CompanyAccount[]>([]);
  readonly mappings = signal<Mapping[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);

  readonly templateDropZoneIds = computed(() =>
    this.templateAccounts().map((account) => this.dropZoneId(account.id))
  );

  readonly hasNoMappings = computed(
    () => this.templateAccounts().length > 0 && this.mappings().length === 0
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loadError.set('Template ID is missing.');
      this.loading.set(false);
      return;
    }

    this.templateId.set(id);
    this.loadData(id, true);
  }

  dropZoneId(templateAccountId: string): string {
    return `drop-${templateAccountId}`;
  }

  getMappingsForAccount(templateAccountId: string): Mapping[] {
    return this.mappings().filter(
      (mapping) => mapping.templateAccountId === templateAccountId
    );
  }

  onDrop(event: CdkDragDrop<CompanyAccount[]>, templateAccount: TemplateAccount): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const companyAccount = event.item.data as CompanyAccount;
    this.actionError.set(null);

    this.mappingService
      .createMapping({
        templateAccountId: templateAccount.id,
        companyAccountId: companyAccount.id,
      })
      .subscribe({
        next: () => {
          this.toast.show('Mapping created successfully.');
          this.loadData(this.templateId(), false);
        },
        error: (err: unknown) => {
          this.actionError.set(
            extractErrorMessage(err, 'Failed to create mapping. It may already exist.')
          );
        },
      });
  }

  removeMapping(mapping: Mapping): void {
    const dialogRef = this.dialog.open<boolean, ConfirmDialogData>(ConfirmDialogComponent, {
      data: {
        title: 'Remove Mapping',
        message: `Remove mapping to "${mapping.companyAccountName}"?`,
        confirmLabel: 'Remove',
        cancelLabel: 'Cancel',
      },
    });

    dialogRef.closed
      .pipe(
        filter((confirmed) => confirmed === true),
        switchMap(() => this.mappingService.deleteMapping(mapping.id))
      )
      .subscribe({
        next: () => {
          this.actionError.set(null);
          this.toast.show('Mapping removed successfully.');
          this.loadData(this.templateId(), false);
        },
        error: (err: unknown) => {
          this.actionError.set(
            extractErrorMessage(err, 'Failed to remove mapping. Please try again.')
          );
        },
      });
  }

  onBack(): void {
    void this.router.navigate(['/templates']);
  }

  private loadData(templateId: string, showLoading: boolean): void {
    if (showLoading) {
      this.loading.set(true);
      this.loadError.set(null);
    }

    forkJoin({
      template: this.templateService.getTemplateById(templateId),
      companyAccounts: this.companyAccountService.getCompanyAccounts(),
      mappings: this.mappingService.getMappings(templateId),
    }).subscribe({
      next: ({ template, companyAccounts, mappings }) => {
        this.templateName.set(template.name);
        this.templateAccounts.set(template.templateAccounts);
        this.companyAccounts.set(companyAccounts);
        this.mappings.set(mappings);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        if (showLoading) {
          this.loadError.set(
            extractErrorMessage(err, 'Failed to load mapping data. Please try again.')
          );
        } else {
          this.actionError.set(extractErrorMessage(err, 'Failed to refresh mapping data.'));
        }
        this.loading.set(false);
      },
    });
  }
}
