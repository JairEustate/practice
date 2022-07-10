import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { CarteraRoutingModule } from './cartera-routing.module';
import { GraphicsChartjsModule } from '../../shared/components/graphics/chartjs/chartjs.module';
import { Gestion, GestionDialog } from './gestion/gestion.component';
import { Conciliacion, ConciliacionDialog } from './conciliacion/conciliacion.component';

@NgModule({
  declarations: [Gestion, GestionDialog, Conciliacion, ConciliacionDialog],
  imports: [SharedModule, GraphicsChartjsModule, CarteraRoutingModule],
})
export class CarteraModule {}
