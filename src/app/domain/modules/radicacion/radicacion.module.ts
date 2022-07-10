import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { RadicacionRoutingModule } from './radicacion-routing.module';
import { ReporteSabanas } from './reporte-sabanas/reporte-sabanas.component';
import { ReporteSabanasPdf } from './reporte-sabanas/pdf/pdf.component';

@NgModule({
  declarations: [ReporteSabanas, ReporteSabanasPdf],
  imports: [SharedModule, RadicacionRoutingModule],
})
export class RadicacionModule {}
