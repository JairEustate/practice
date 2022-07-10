import { NgModule } from '@angular/core';
import { Accesscontrol } from './accesscontrol.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [Accesscontrol],
  imports: [AppRoutingModule],
  exports: [Accesscontrol],
})
export class AccesscontrolModule {}
