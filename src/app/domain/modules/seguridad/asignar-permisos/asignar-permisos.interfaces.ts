export interface UsuarioI {
  id: number;
  idRol: number;
  rol: string;
  identification: string;
  status: boolean;
  user: string;
}

export interface PermisoI {
  tipo: string;
  codigo: string;
  nombre: string;
}
