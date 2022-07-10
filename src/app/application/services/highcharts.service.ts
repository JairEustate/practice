import { Injectable } from '@angular/core';

import * as Highcharts from 'highcharts';
@Injectable({
  providedIn: 'root',
})
export class HighchartsService {
  private Highcharts: typeof Highcharts = Highcharts;

  public translateHighcharts(lang: string = 'es'): void {
    if (lang === 'es') {
      this.Highcharts.setOptions({
        lang: {
          thousandsSep: ',',
          viewFullscreen: 'Pantalla completa',
          exitFullscreen: 'Salir de pantalla completa',
          contextButtonTitle: 'Opciones',
          downloadJPEG: 'Descargar JPEG',
          downloadPDF: 'Descargar PDF',
          downloadPNG: 'Descargar PNG',
          downloadSVG: 'Descargar SVG',
          printChart: 'Imprimir gráfico',
          resetZoom: 'Reiniciar zoom',
        },
      });
    }
  }
}
