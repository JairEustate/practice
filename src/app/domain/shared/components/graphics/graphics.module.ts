import { NgModule } from '@angular/core';
import { GraphicsChartjsModule } from './chartjs/chartjs.module';
import { GraphicsHighchartsModule } from './highcharts/highcharts.module';

@NgModule({
  imports: [GraphicsHighchartsModule, GraphicsChartjsModule],

  exports: [GraphicsHighchartsModule, GraphicsChartjsModule],
})
export class GraphicsModule {}
