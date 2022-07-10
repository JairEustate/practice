import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { GraphicsModule } from 'src/app/domain/shared/components/graphics/graphics.module';
import { InformesGerencialesRoutingModule } from './informes-gerenciales-routing.module';
import { EstadisticoPfgpConsolidado } from './estadistico-pfgp/consolidado/consolidado.component';
import { EstadisticoPfgpFacturado } from './estadistico-pfgp/facturado/facturado.component';
import { EstadisticoPfgpGraficas } from './estadistico-pfgp/graficas/graficas.component';
import { EstadisticoPfgp } from './estadistico-pfgp/estadistico-pfgp.component';
import { EstadisticoPfgpAcostado } from './estadistico-pfgp/acostado/acostado.component';
import { EstadisticoRadicacion } from './estadistico-radicacion/estadistico-radicacion.component';
import { EstadisticoRadicacionDialog } from './estadistico-radicacion/dialog/dialog.component';
import { FacturacionPeriodo } from './facturacion-periodo/facturacion-periodo.component';
import { FacturacionPeriodoDialog } from './facturacion-periodo/dialog/dialog.component';
@NgModule({
  declarations: [
    EstadisticoPfgpConsolidado,
    EstadisticoPfgpFacturado,
    EstadisticoPfgpGraficas,
    EstadisticoPfgpAcostado,
    EstadisticoPfgp,
    EstadisticoRadicacion,
    EstadisticoRadicacionDialog,
    FacturacionPeriodo,
    FacturacionPeriodoDialog,
  ],
  imports: [SharedModule, GraphicsModule, InformesGerencialesRoutingModule],
})
export class InformesGerencialesModule {}
