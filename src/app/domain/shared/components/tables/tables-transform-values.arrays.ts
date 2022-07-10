// -- pesos -- se agrega la extensión kl(s)
export const isWeight = [
  'HCRPESO'
];
// -- date4 -- se da formato de fecha al valor 'D/MMM/YYYY' (15/feb./2022).
export const isDate4 = [
  'FechaIngreso','FechaSalida','FECHA_REPORTE','HESFECING','HESFECSAL','SFAFECFAC',
  'AINFECING',
];
// -- date5 -- se da formato de fecha al valor 'D/MM/YYYY' (15/02/2022).
export const isDate5 = [
  'FECHA','FECHCONCI','FechaConciliacion','FechaGestion'
];
// -- day -- se agrega la extensión día(s)
export const isDay = [
  'FECHA','Dias','AINDIAEST','ESTANCIA'
];
// -- age -- se agrega la extensión año(s)
export const isAge = [
  'GPAEDAPAC'
];
// -- percentage -- se agrega la extensión % y se fixea el numero
export const isPercentage = [
  'PORC_OCUPADAS','PORC_DESOCUPADAS','PROMEDIODOC','PORC','ErrorRelativo','Porcentaje'
];
// -- value -- se da formato al numero para que represente un valor
export const isValue = [
  'VALOR_JORNADA','VALOR_DIETA','PRODUCCION','TOTALFACTURASANULADAS','TOTALREFACTURADA',
  'FACTURADO','PROMEDIOFACT','RADICABLE','RADICADO','SFATOTFAC','TotalEjecutado',
  'ValorAnticipo','TotalFacturado','TotalAnticipo','Cme','SUMA','ErrorAbsoluto',
  'Disponibilidad','CmeEjecutado','CmeFacturado','TotalCargado','TotalContratado',
];
