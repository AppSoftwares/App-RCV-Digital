export interface Transaction {
  id: string;
  invoice_id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: 'policy_premium' | 'tax_iva' | 'surety_reserve' | 'commission';
  amount_usd: number;
  amount_ves: number;
  exchange_rate: number;
  description: string;
  status: 'pending' | 'posted' | 'reconciled';
  created_at: string;
}

export interface SuretyFund {
  total_reserve_usd: number;
  total_reserve_ves: number;
  required_minimum_usd: number;
  last_update: string;
}

export interface FiscalReport {
  period: string; // YYYY-MM
  total_iva_ves: number;
  total_income_ves: number;
  transaction_count: number;
}
