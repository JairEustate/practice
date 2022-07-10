import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { FacturacionRoutingModule } from './facturacion-routing.module';
import { ConceptosAdmision } from './conceptos-admision/conceptos-admision.component';
import { ConceptosAdmisionDialog } from './conceptos-admision/dialog/dialog.component';

@NgModule({
  declarations: [ConceptosAdmision, ConceptosAdmisionDialog],
  imports: [SharedModule, FacturacionRoutingModule],
})
export class FacturacionModule {}
