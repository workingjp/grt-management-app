import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Template, TemplateAccount, TemplateDetail } from '../models/template.model';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/templates';
  private readonly templateAccountApiUrl = '/api/template-accounts';

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }

  getTemplateById(id: string): Observable<TemplateDetail> {
    return this.http.get<TemplateDetail>(`${this.apiUrl}/${id}`);
  }

  createTemplate(name: string): Observable<Template> {
    return this.http.post<Template>(this.apiUrl, { name });
  }

  updateTemplate(id: string, name: string): Observable<Pick<Template, 'id' | 'name' | 'group'>> {
    return this.http.put<Pick<Template, 'id' | 'name' | 'group'>>(`${this.apiUrl}/${id}`, { name });
  }

  deleteTemplate(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  addTemplateAccount(templateId: string, name: string): Observable<TemplateAccount> {
    return this.http.post<TemplateAccount>(`${this.apiUrl}/${templateId}/accounts`, { name });
  }

  deleteTemplateAccount(accountId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.templateAccountApiUrl}/${accountId}`);
  }
}
