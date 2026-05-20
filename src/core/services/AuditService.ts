import { UserRole } from '../../types';

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId?: string;
  userRole?: UserRole;
  action: string;
  category: 'security' | 'accounting' | 'admin';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  ip?: string;
  metadata?: any;
}

export class AuditService {
  private logs: AuditEntry[] = [];

  log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): void {
    const newEntry: AuditEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(newEntry);
    if (this.logs.length > 100) this.logs.pop();
  }

  getLogs(category?: AuditEntry['category']): AuditEntry[] {
    if (category) return this.logs.filter(l => l.category === category);
    return this.logs;
  }

  detectAnomalies(): string[] {
    const anomalies: string[] = [];
    const recentSecurityLogs = this.logs.filter(l =>
      l.category === 'security' &&
      (Date.now() - new Date(l.timestamp).getTime()) < 3600000
    );
    const loginFailures = recentSecurityLogs.filter(l => l.action === 'LOGIN_FAILED');
    if (loginFailures.length > 5) {
      anomalies.push("Fuerza bruta detectada");
    }
    return anomalies;
  }
}

export const auditService = new AuditService();
