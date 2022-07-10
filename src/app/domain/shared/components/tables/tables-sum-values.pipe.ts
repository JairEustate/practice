import { Pipe, PipeTransform } from '@angular/core';

const valuesToSum: any = [
  'CAMAS','OCUPADAS','DESOCUPADAS','PACIENTES','TotalEjecutado','SUMA','VALOR_JORNADA',
  'VALOR_DIETA','VALOR','PRODUCCION','CANTIDADREFACTURADA','DOCUMENTOS',
  'FACTURASANULADAS','TOTALFACTURASANULADAS','TOTALREFACTURADA','FACTURADO',
  'PROMEDIOFACT','CANT','RAD','ANU','FACTURADO','RADICABLE','RADICADO','SFATOTFAC',
  'Iteraciones','TotalEjecutado','TotalFacturado','TotalCargado','TotalContratado',
  'ErrorAbsoluto','ValorAnticipo','Eventos','CmeEjecutado','CmeFacturado','TotalAnticipo',
  'EventosSobrantes','Cme','CANTIDAD'
];
@Pipe({
  name: 'SumTableValues',
})
export class TablesSumValuesPipe implements PipeTransform {
  transform(item: string, dataSource: any): any {
    if (valuesToSum.indexOf(item) >= 0) {
      const result = dataSource
        .map((t: any) => t[item])
        .reduce((acc: any, value: any) => acc + value, 0);
      if (!isNaN(result)) {
        return new Intl.NumberFormat().format(Math.round(result));
      }
    }
  }
}
