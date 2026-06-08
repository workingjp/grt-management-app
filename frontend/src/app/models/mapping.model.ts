export interface Mapping {
  id: string;
  templateAccountId: string;
  companyAccountId: string;
  companyAccountName: string;
}

export interface CreateMappingRequest {
  templateAccountId: string;
  companyAccountId: string;
}
