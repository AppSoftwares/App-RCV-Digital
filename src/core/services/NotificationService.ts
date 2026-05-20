import { AppNotification } from '../../types';
import { apiBreaker } from '../../infrastructure/network/CircuitBreaker';

export class NotificationService {
  private notifications: AppNotification[] = [];

  async sendPush(title: string, body: string, type: AppNotification['type'], severity: AppNotification['severity']): Promise<void> {
    return await apiBreaker.execute(async () => {
      const notification: AppNotification = {
        id: `ntf_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title,
        body,
        type,
        severity,
        timestamp: new Date().toISOString(),
        read: false
      };

      this.notifications.unshift(notification);
      console.log(`[Push] Sent: ${title}`);
    });
  }

  async sendEmailReminder(email: string, subject: string, content: string): Promise<void> {
    return await apiBreaker.execute(async () => {
      console.log(`[Email] To: ${email} | Subject: ${subject}`);
      return new Promise(resolve => setTimeout(resolve, 1000));
    });
  }

  async checkPolicyExpirations(policies: { id: string, email: string, expiryDate: string }[]): Promise<void> {
    const today = new Date();
    for (const policy of policies) {
      const expiry = new Date(policy.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 7 && diffDays > 0) {
        await this.sendPush(
          "Renovación de Póliza",
          `Tu póliza #${policy.id} vence en ${diffDays} días. Renueva ahora para mantener tu protección.`,
          'policy_expiration',
          'urgent'
        );
        await this.sendEmailReminder(policy.email, "Aviso de Vencimiento", `Tu seguro RCV vencerá pronto.`);
      }
    }
  }

  getNotifications(): AppNotification[] {
    return this.notifications;
  }

  markAsRead(id: string): void {
    const n = this.notifications.find(item => item.id === id);
    if (n) n.read = true;
  }
}

export const notificationService = new NotificationService();
