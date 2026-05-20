import { AccidentReport } from '../../types';
import { apiBreaker } from '../../infrastructure/network/CircuitBreaker';
import { notificationService } from './NotificationService';
import { auditService } from './AuditService';

export class AccidentService {
  private reports: AccidentReport[] = [];

  async submitReport(report: Omit<AccidentReport, 'id' | 'status' | 'timestamp'>): Promise<AccidentReport> {
    return await apiBreaker.execute(async () => {
      const newReport: AccidentReport = {
        ...report,
        id: `rep_${Date.now()}`,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      this.reports.unshift(newReport);

      auditService.log({
        action: 'ACCIDENT_REPORT_SUBMITTED',
        category: 'security',
        severity: 'high',
        details: `Reporte de accidente: ${newReport.id}`,
        metadata: { location: newReport.location }
      });

      await notificationService.sendPush(
        "Reporte Recibido",
        "Hemos recibido tu reporte de accidente. Un operador se comunicará contigo en breve.",
        'accident_report',
        'urgent'
      );

      return newReport;
    });
  }

  getReports(): AccidentReport[] {
    return this.reports;
  }
}

export const accidentService = new AccidentService();
