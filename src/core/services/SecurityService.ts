import { UserRole } from '../../types';

/**
 * Servicio centralizado de seguridad para control de acceso (RBAC)
 */
export class SecurityService {
  /**
   * Verifica si un rol tiene permiso para realizar una acción específica.
   */
  hasPermission(userRole: string | undefined, action: 'view_financials' | 'manage_users' | 'issue_policy' | 'admin_all'): boolean {
    const permissions: Record<string, string[]> = {
      'admin': ['view_financials', 'manage_users', 'issue_policy', 'admin_all'],
      'contador': ['view_financials'], // El contador solo ve información fiscal/contable
      'operador': ['issue_policy', 'view_financials'], // El operador puede ver financieros básicos
      'cliente': ['issue_policy']
    };

    if (!userRole) return false;

    return permissions[userRole]?.includes(action) || false;
  }

  /**
   * Verifica si el usuario está activo. Protege contra hurtos o acceso de terceros.
   */
  isActive(userStatus: 'active' | 'deactivated' | undefined): boolean {
    return userStatus === 'active';
  }
}

export const securityService = new SecurityService();
