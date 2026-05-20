export type UserRole = 'cliente' | 'operador' | 'admin' | 'contador';

export interface MedicalInfo {
  tipoSangre?: string;
  alergias?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
}

export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  status: 'active' | 'deactivated';
  avatar?: string;
  medicalInfo?: MedicalInfo;
}

export interface ExtractedData {
  nombre?: string;
  cedula?: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  anio?: string;
  email?: string;
  telefono?: string;
  medicalInfo?: MedicalInfo;
}

export type AppStep = 'landing' | 'upload' | 'summary' | 'success';

export interface PolicyRecord extends ExtractedData {
  id?: string;
  created_at: string;
  status: 'active' | 'expired' | 'pending';
  price: number;
  userId: string;
}

export interface EmergencyAlert {
  id: string;
  policyId: string;
  location: { lat: number; lng: number };
  timestamp: string;
  status: 'alerted' | 'monitoring' | 'resolved';
}

export interface AccidentReport {
  id: string;
  userId: string;
  policyId: string;
  timestamp: string;
  location: { lat: number; lng: number; address?: string };
  description: string;
  photos: string[];
  status: 'pending' | 'reviewing' | 'dispatched' | 'resolved';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'policy_expiration' | 'status_update' | 'accident_report' | 'system';
  severity: 'info' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
