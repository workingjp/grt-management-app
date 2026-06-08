import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CompanyAccount } from '../models/company-account.model';

@Injectable({ providedIn: 'root' })
export class CompanyAccountService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBasePath}/company-accounts`;

  getCompanyAccounts(): Observable<CompanyAccount[]> {
    return this.http.get<CompanyAccount[]>(this.apiUrl);
  }
}
