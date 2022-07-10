export interface AuthTokenI {
  exp: number;
  iat: number;
  sub: {
    connection: string;
    idUsuario: number;
  };
}
