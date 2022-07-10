import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartjsArea } from './area/area.component';
import { ChartjsDonut } from './donut/donut.component';
import { ChartjsStackedBar } from './stacked-bar/stacked-bar.component';

@NgModule({
  declarations: [ChartjsStackedBar, ChartjsDonut, ChartjsArea],
  exports: [ChartjsStackedBar, ChartjsDonut, ChartjsArea],
  imports: [NgChartsModule],
})
export class GraphicsChartjsModule {}
