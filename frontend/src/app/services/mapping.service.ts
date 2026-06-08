import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateMappingRequest, Mapping } from '../models/mapping.model';

@Injectable({ providedIn: 'root' })
export class MappingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/mappings';
  private readonly templatesApiUrl = '/api/templates';

  getMappings(templateId: string): Observable<Mapping[]> {
    return this.http.get<Mapping[]>(`${this.templatesApiUrl}/${templateId}/mappings`);
  }

  createMapping(request: CreateMappingRequest): Observable<Mapping> {
    return this.http.post<Mapping>(this.apiUrl, request);
  }

  deleteMapping(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
