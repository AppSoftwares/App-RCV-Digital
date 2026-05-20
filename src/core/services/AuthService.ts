import { UserProfile, UserRole } from '../../types';
import { normalizeEmail, validateAuthInput } from '../../shared/security';
import { globalRateLimiter } from '../../infrastructure/network/RateLimiter';
import { auditService } from './AuditService';

export class AuthService {
  async login(rawIdentifier: unknown, rawPassword: unknown): Promise<UserProfile> {
    const identifier = normalizeEmail(rawIdentifier);
    this.monitorPatterns(rawIdentifier, rawPassword);

    if (!globalRateLimiter.isAllowed(`login_${identifier}`)) {
      auditService.log({
        action: 'LOGIN_BLOCKED',
        category: 'security',
        severity: 'high',
        details: `Rate limit: ${identifier}`,
        metadata: { identifier }
      });
      throw new Error("Demasiados intentos. Por favor, espere.");
    }

    const validatedId = validateAuthInput(rawIdentifier);
    const validatedPass = validateAuthInput(rawPassword);

    if (!validatedId.isValid || !validatedPass.isValid) {
      throw new Error("Credenciales inválidas");
    }

    const mockUsers: Record<string, any> = {
      'admin@rcv.com': { role: 'admin', hash: 'HASH_BCRYPT_ADMIN' },
      'contador@rcv.com': { role: 'contador', hash: 'HASH_BCRYPT_CONTADOR' },
      'operador@rcv.com': { role: 'operador', hash: 'HASH_BCRYPT_OPERADOR' },
      'cliente@rcv.com': { role: 'cliente', hash: 'HASH_BCRYPT_CLIENTE' }
    };

    const userInDb = mockUsers[validatedId.value];
    const isPasswordCorrect = userInDb && await this.compareHash(validatedPass.value, userInDb.hash);

    if (!userInDb || !isPasswordCorrect) {
      auditService.log({
        action: 'LOGIN_FAILED',
        category: 'security',
        severity: 'medium',
        details: `Fallo: ${validatedId.value}`
      });
      throw new Error("Credenciales inválidas");
    }

    auditService.log({
      action: 'LOGIN_SUCCESS',
      category: 'security',
      severity: 'low',
      details: `Login: ${validatedId.value}`,
      userId: validatedId.value,
      userRole: userInDb.role as UserRole
    });

    return {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      nombre: `Usuario ${userInDb.role}`,
      email: validatedId.value,
      role: userInDb.role as UserRole,
      status: 'active'
    };
  }

  private monitorPatterns(id: any, pass: any) {
    const suspiciousTags = ['$gt', '$ne', '$where', '{', '}'];
    const stringified = JSON.stringify({ id, pass });
    if (suspiciousTags.some(tag => stringified.includes(tag))) {
      auditService.log({
        action: 'NOSQL_INJECTION_ATTEMPT',
        category: 'security',
        severity: 'critical',
        details: `Patrón sospechoso detectado`,
        metadata: { input: stringified }
      });
    }
  }

  private async compareHash(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }
}

export const authService = new AuthService();
