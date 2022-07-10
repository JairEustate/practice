import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Dashboard } from './dashboard.component';

@NgModule({
  declarations: [Dashboard],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
