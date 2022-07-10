export interface InfoIngresoI {
  CONS_INGRESO: number;
  OID: number;
  CAMA: string;
  GRUPO_CAMA: string;
  PACNUMDOC: string;
  GPANOMCOM: string;
  FECHA_REGISTRO_ENF: string;
  GDENOMBRE: string;
  PESO: number;
}
export interface GlucometriaI {
  hora: number;
  oid: number;
  HORAREG: any;
  RESULTADO: any;
  FECHA_REGISTRO_ENF: any;
  GLUCOMETRIA: string;
  INGRESO: any;
  CAMA: any;
  GRUPO_CAMA: any;
}
export interface SignosI {
  signo: string;
  resultados: ResultadosI[];
}
export interface LiquidosI {
  liquido: string;
  resultado: ResultadosI[];
}
export interface ResultadosI {
  hora: number;
  oid: number;
  HORAREG: number;
  SIGNO?: string;
  LIQUIDO?: string;
  VALOR: string;
  CATEGORIA?: string;
  CANTIDAD?: number;
  SUBGRUPO: string;
  FECHA_REGISTRO_ENF: string;
}
