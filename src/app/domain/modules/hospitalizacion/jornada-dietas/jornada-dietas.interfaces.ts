export interface JornadaDietaI {
  CODIGO: number; //GCMDIEJOR
  TOTAL_PACIENTES: number; //PACIENTES
  CENTRO_ATENCION: string; //adncenate
  FECHA_REPORTE: string; //fecha
  JORNADA: string; //jornda
  VALOR_JORNADA: number; //TOTALJORNADA
}

export interface JornadaDietaDetalleI {
  CAMA: string; //CAMA
  PACIENTE: string; //CONSISTENCIA
  JORNADA_DIETA: string; //JORNADA
  TIPO_DIETA: string; //TIPO
  CONSISTENCIA_DIETA: string; //CONSISTENCIA
  VALOR_DIETA: number; //VALOR
}
