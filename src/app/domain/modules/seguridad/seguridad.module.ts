import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { AsignarPermisos } from './asignar-permisos/asignar-permisos.component';

@NgModule({
  declarations: [AsignarPermisos],
  imports: [SharedModule, SeguridadRoutingModule],
})
export class SeguridadModule {}
