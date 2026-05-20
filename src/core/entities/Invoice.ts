export interface Invoice {
  id: string;
  invoice_number: string; // Formato fiscal
  user_id: string;
  amount: number;
  currency: 'USD' | 'VES';
  exchange_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  payment_method: string;
  fiscal_data: {
    business_name: string;
    rif: string;
    address: string;
  };
  created_at: string;
}
