import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { BalancesEnfermeriaRoutingModule } from './balances-enfermeria-routing.module';
import { SabanasUci } from './sabanas-uci/sabanas-uci.component';

@NgModule({
  declarations: [SabanasUci],
  imports: [SharedModule, BalancesEnfermeriaRoutingModule],
})
export class BalancesEnfermeriaModule {}
