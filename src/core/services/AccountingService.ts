import { Transaction } from '../entities/Accounting';
import { apiBreaker } from '../../infrastructure/network/CircuitBreaker';
import { securityService } from './SecurityService';
import { financialService } from './FinancialService';
import { auditService } from './AuditService';

export class AccountingService {
  private readonly IVA_RATE = 0.16;
  private readonly SURETY_RESERVE_RATE = 0.03;

  async recordPolicySale(
    invoiceId: string,
    userId: string,
    totalAmountUsd: number,
    bcvRate: number
  ): Promise<boolean> {
    return await apiBreaker.execute(async () => {
      const netPremiumUsd = totalAmountUsd / (1 + this.IVA_RATE);
      const ivaUsd = totalAmountUsd - netPremiumUsd;
      const suretyReserveUsd = netPremiumUsd * this.SURETY_RESERVE_RATE;

      const transactions: Partial<Transaction>[] = [
        {
          invoice_id: invoiceId,
          user_id: userId,
          type: 'income',
          category: 'policy_premium',
          amount_usd: netPremiumUsd,
          amount_ves: netPremiumUsd * bcvRate,
          exchange_rate: bcvRate,
          description: `Prima neta RCV - Factura ${invoiceId}`,
          status: 'posted'
        },
        {
          invoice_id: invoiceId,
          user_id: userId,
          type: 'income',
          category: 'tax_iva',
          amount_usd: ivaUsd,
          amount_ves: ivaUsd * bcvRate,
          exchange_rate: bcvRate,
          description: `IVA 16% - Factura ${invoiceId}`,
          status: 'posted'
        },
        {
          invoice_id: invoiceId,
          user_id: userId,
          type: 'expense',
          category: 'surety_reserve',
          amount_usd: suretyReserveUsd,
          amount_ves: suretyReserveUsd * bcvRate,
          exchange_rate: bcvRate,
          description: `Reserva Legal de Fianza Sudeaseg`,
          status: 'posted'
        }
      ];

      auditService.log({
        action: 'POLICY_SALE_RECORDED',
        category: 'accounting',
        severity: 'low',
        details: `Venta: Factura ${invoiceId}`,
        metadata: { invoiceId, totalAmountUsd }
      });

      return true;
    });
  }

  async getFiscalSummary(month: string, userRole?: string): Promise<any> {
    if (!securityService.hasPermission(userRole, 'view_financials')) {
      throw new Error("Acceso denegado");
    }

    return {
      periodo: month,
      iva_a_pagar_ves: 15420.50,
      ingreso_bruto_ves: 96378.12,
      reserva_fianza_acumulada_usd: 2450.00
    };
  }

  generateSeniatTxt(transactions: Transaction[]): string {
    const header = "RIF_EMISOR;NUM_FACTURA;NUM_CONTROL;FECHA;RIF_CLIENTE;MONTO_TOTAL;BASE_IMPONIBLE;IVA_16";
    const rows = transactions
      .filter(t => t.category === 'policy_premium' || t.category === 'tax_iva')
      .map(t => {
        return `J503445141;${t.invoice_id};CTRL-001;${t.created_at};V12345678;${t.amount_ves.toFixed(2)};${(t.amount_ves/1.16).toFixed(2)};${(t.amount_ves * 0.16).toFixed(2)}`;
      });

    return [header, ...rows].join("\n");
  }
}

export const accountingService = new AccountingService();
