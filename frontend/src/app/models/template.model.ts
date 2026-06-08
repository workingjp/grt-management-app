export interface Template {
  id: string;
  name: string;
  group: string;
  mappedAccountsCount: number;
  unmappedAccountsCount: number;
}

export interface TemplateAccount {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateDetail {
  id: string;
  name: string;
  group: string;
  templateAccounts: TemplateAccount[];
}

export interface LocalAccount {
  id?: string;
  name: string;
}
