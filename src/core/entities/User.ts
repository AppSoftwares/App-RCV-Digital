export interface User {
  id: string;
  email: string;
  full_name: string;
  rif?: string;
  phone?: string;
  role: 'client' | 'admin' | 'broker';
  created_at: string;
}

export interface SearchCriteria {
  query: string;
  limit?: number;
  offset?: number;
}
