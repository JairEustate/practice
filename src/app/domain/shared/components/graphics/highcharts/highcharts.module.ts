import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { HighchartsArea } from './area/area.component';
import { HighchartsColumn } from './column/column.component';
import { HighchartsPie } from './pie/pie.component';
import { HighchartsSpline } from './spline/spline.component';

@NgModule({
  declarations: [HighchartsColumn, HighchartsSpline, HighchartsArea, HighchartsPie],
  exports: [HighchartsColumn, HighchartsSpline, HighchartsArea, HighchartsPie],
  imports: [HighchartsChartModule],
})
export class GraphicsHighchartsModule {}
