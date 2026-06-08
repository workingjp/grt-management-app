import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CompanyAccount } from '../models/company-account.model';

@Injectable({ providedIn: 'root' })
export class CompanyAccountService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/company-accounts';

  getCompanyAccounts(): Observable<CompanyAccount[]> {
    return this.http.get<CompanyAccount[]>(this.apiUrl);
  }
}
