import { Injectable } from "@angular/core";
import jwt_decode from "jwt-decode";
import { AuthTokenI } from "../interfaces/auth-token.interface";

@Injectable({
  providedIn: "root",
})
export class JwtService {
  constructor() {}

  /**
   * Retorna el token decodificado, obtiene token de localStorage por defecto.
   * @returns number | null
   */
  decode(token: string = localStorage.getItem("AuthToken")!): AuthTokenI | null {
    try {
      const tok: AuthTokenI = jwt_decode(token);
      return tok;
    } catch (error) {
      return null;
    }
  }
}
