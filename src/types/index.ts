export type UserRole = 'cliente' | 'operador' | 'contador' | 'admin';

export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'inactive';
}

export interface ExtractedData {
  nombre?: string;
  cedula?: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  año?: number;
  color?: string;
  direccion?: string;
  email?: string;
  telefono?: string;
  medicalInfo?: {
    tipoSangre?: string;
    contactoEmergenciaTelefono?: string;
    alergias?: string;
  };
}

// --- NUEVOS MODELOS SEGÚN PROMPT MÓDULO 1 ---

export interface ClienteAsegurado {
    id?: number;
    fechaRegistro: string;
    nombres: string;
    apellidos: string;
    cedulaTipo: 'V' | 'E' | 'J' | 'G';
    cedulaNumero: string;
    fechaNacimiento: string;
    edad: number;
    genero: 'Masculino' | 'Femenino' | 'Otro';
    estadoCivil: string;
    profesion: string;
    telefono: string;
    telefonoAlternativo?: string;
    correoElectronico: string;
    estadoResidencia: string;
    municipioResidencia: string;
    parroquiaResidencia: string;
    direccionCompleta: string;

    // Póliza
    numeroPoliza: string;
    tipoPoliza: 'RCV' | 'BPV' | 'TPG' | 'Casco Amplio' | 'Casco Limitado';
    fechaInicioPoliza: string;
    fechaVencimientoPoliza: string;
    montoAsegurado: number;
    primaMensual: number;
    condicionPago: string;

    // Documentos (Rutas o Base64)
    rutaFotoCedulaAnverso?: string;
    rutaFotoCedulaReverso?: string;
    rutaFotoCarnetCirculacion?: string;
    rutaFotoPerfilCliente?: string;

    estadoRegistro: 'PENDIENTE' | 'ACTIVO' | 'SUSPENDIDO' | 'VENCIDO';
    observacionesOperador?: string;

    vehiculo: VehiculoAsegurado;
    funcionario?: FuncionarioPolicial;
}

export interface VehiculoAsegurado {
    placa: string;
    marca: string;
    modelo: string;
    año: number;
    color: string;
    tipoVehiculo: string;
    uso: string;
    numeroSerial: string;
    numeroMotor: string;
    numeroPuestos: number;
    tonelaje?: string;
    fotos: {
        frente?: string;
        lateral?: string;
        trasero?: string;
        carnet?: string;
    }
}

export interface FuncionarioPolicial {
    esFuncionario: boolean;
    nombres: string;
    apellidos: string;
    cedulaTipo: string;
    cedulaNumero: string;
    rango: string;
    organismo: string;
    unidadAsignada: string;
    numeroCredencial: string;
    telefono: string;
    correoInstitucional: string;
    fotoCredencial?: string;
}
