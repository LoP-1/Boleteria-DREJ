export interface Usuario {
  dni: string;
  nombreCompleto: string;
  password?: string;
  rol?: string;
}

export interface RegisterUsuarioRequest {
  dni: string;
  nombreCompleto: string;
  password: string;
  rol: string;
}

export interface EditUsuarioRequest {
  nombreCompleto?: string;
  password?: string;
  rol?: string; 
}

export interface LoginRequest {
  dni: string;
  password: string;
}

export interface LoginResponse {
  dni: string;
  nombreCompleto: string;
  rol?: string;
}