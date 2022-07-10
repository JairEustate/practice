import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { HistoriaClinicaRoutingModule } from './historia-clinica-routing.module';
import { DesconfirmarEpicrisis } from './desconfirmar-epicrisis/desconfirmar-epicrisis.component';
import { InterconsultasPendientes } from './interconsultas-pendientes/interconsultas-pendientes.component';
@NgModule({
  declarations: [DesconfirmarEpicrisis, InterconsultasPendientes],
  imports: [SharedModule, HistoriaClinicaRoutingModule],
})
export class HistoriaClinicaModule {}
