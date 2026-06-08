import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';

import { LocalAccount } from '../../../models/template.model';
import { TemplateService } from '../../../services/template.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.css',
})
export class TemplateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly templateService = inject(TemplateService);
  private readonly toast = inject(ToastService);

  readonly templateId = signal<string | null>(null);
  readonly isEditMode = computed(() => this.templateId() !== null);
  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Edit Template' : 'Create Template'
  );

  readonly accounts = signal<LocalAccount[]>([]);
  readonly deletedAccountIds = signal<string[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);

  readonly templateForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    group: [{ value: 'SaaS', disabled: true }],
  });

  readonly accountForm = this.fb.nonNullable.group({
    accountName: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.templateId.set(id);
      this.loadTemplate(id);
    }
  }

  addAccount(): void {
    const name = this.accountForm.controls.accountName.value.trim();
    if (!name) {
      this.accountForm.controls.accountName.setValidators(Validators.required);
      this.accountForm.controls.accountName.setValue('');
      this.accountForm.controls.accountName.markAsTouched();
      this.accountForm.controls.accountName.updateValueAndValidity();
      return;
    }

    this.accountForm.controls.accountName.clearValidators();
    this.accountForm.controls.accountName.setValue('');
    this.accountForm.controls.accountName.markAsUntouched();
    this.accountForm.controls.accountName.updateValueAndValidity();

    this.accounts.update((list) => [...list, { name }]);
  }

  removeAccount(index: number): void {
    const account = this.accounts()[index];
    if (account?.id) {
      this.deletedAccountIds.update((ids) => [...ids, account.id!]);
    }
    this.accounts.update((list) => list.filter((_, i) => i !== index));
  }

  onCancel(): void {
    void this.router.navigate(['/templates']);
  }

  onSave(): void {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    this.saveError.set(null);
    this.saving.set(true);

    const name = this.templateForm.controls.name.value.trim();

    if (this.isEditMode()) {
      this.saveEdit(name);
      return;
    }

    this.saveCreate(name);
  }

  private loadTemplate(id: string): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.templateService.getTemplateById(id).subscribe({
      next: (template) => {
        this.templateForm.patchValue({
          name: template.name,
          group: template.group,
        });
        this.accounts.set(
          template.templateAccounts.map((account) => ({
            id: account.id,
            name: account.name,
          }))
        );
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('Failed to load template. Please try again.');
        this.loading.set(false);
      },
    });
  }

  private saveCreate(name: string): void {
    const accounts = this.accounts();

    this.templateService
      .createTemplate(name)
      .pipe(
        switchMap((template) => {
          if (accounts.length === 0) {
            return of(template);
          }

          return forkJoin(
            accounts.map((account) =>
              this.templateService.addTemplateAccount(template.id, account.name)
            )
          ).pipe(switchMap(() => of(template)));
        })
      )
      .subscribe({
        next: () => this.onSaveSuccess('Template created successfully.'),
        error: () => this.onSaveFailure('Failed to create template. Please try again.'),
      });
  }

  private saveEdit(name: string): void {
    const templateId = this.templateId()!;
    const newAccounts = this.accounts().filter((account) => !account.id);
    const deletedIds = this.deletedAccountIds();

    this.templateService
      .updateTemplate(templateId, name)
      .pipe(
        switchMap(() => {
          const requests = [
            ...deletedIds.map((id) => this.templateService.deleteTemplateAccount(id)),
            ...newAccounts.map((account) =>
              this.templateService.addTemplateAccount(templateId, account.name)
            ),
          ];

          if (requests.length === 0) {
            return of(null);
          }

          return forkJoin(requests);
        })
      )
      .subscribe({
        next: () => this.onSaveSuccess('Template updated successfully.'),
        error: () => this.onSaveFailure('Failed to update template. Please try again.'),
      });
  }

  private onSaveSuccess(message: string): void {
    this.saving.set(false);
    this.toast.show(message);
    void this.router.navigate(['/templates']);
  }

  private onSaveFailure(message: string): void {
    this.saving.set(false);
    this.saveError.set(message);
  }
}
