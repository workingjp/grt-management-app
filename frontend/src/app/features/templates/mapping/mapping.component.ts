import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CompanyAccount } from '../../../models/company-account.model';
import { Mapping } from '../../../models/mapping.model';
import { TemplateAccount } from '../../../models/template.model';
import { CompanyAccountService } from '../../../services/company-account.service';
import { MappingService } from '../../../services/mapping.service';
import { TemplateService } from '../../../services/template.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-mapping',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder],
  templateUrl: './mapping.component.html',
  styleUrl: './mapping.component.css',
})
export class MappingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loadError.set('Template ID is missing.');
      this.loading.set(false);
      return;
    }

    this.templateId.set(id);
    this.loadData(id);
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
          this.refreshMappings();
        },
        error: () => {
          this.actionError.set('Failed to create mapping. It may already exist.');
        },
      });
  }

  removeMapping(mapping: Mapping): void {
    this.actionError.set(null);

    this.mappingService.deleteMapping(mapping.id).subscribe({
      next: () => {
        this.toast.show('Mapping removed successfully.');
        this.refreshMappings();
      },
      error: () => {
        this.actionError.set('Failed to remove mapping. Please try again.');
      },
    });
  }

  onBack(): void {
    void this.router.navigate(['/templates']);
  }

  private loadData(templateId: string): void {
    this.loading.set(true);
    this.loadError.set(null);

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
      error: () => {
        this.loadError.set('Failed to load mapping data. Please try again.');
        this.loading.set(false);
      },
    });
  }

  private refreshMappings(): void {
    this.mappingService.getMappings(this.templateId()).subscribe({
      next: (mappings) => this.mappings.set(mappings),
      error: () => this.actionError.set('Failed to refresh mappings.'),
    });
  }
}
