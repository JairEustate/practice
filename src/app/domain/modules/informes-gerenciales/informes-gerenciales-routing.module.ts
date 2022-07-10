import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { PermisionsGuard } from 'src/app/infrastructure/guards/permissions.guard';
import { EstadisticoPfgp } from './estadistico-pfgp/estadistico-pfgp.component';
import { FacturacionPeriodo } from './facturacion-periodo/facturacion-periodo.component';
import { EstadisticoRadicacion } from './estadistico-radicacion/estadistico-radicacion.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'facturacion-periodo',
        component: FacturacionPeriodo,
        canActivate: [PermisionsGuard],
        data: { permission: '0501' },
      },

      {
        path: 'estadistico-pfgp',
        component: EstadisticoPfgp,
        canActivate: [PermisionsGuard],
        data: { permission: '0502' },
      },
      {
        path: 'estadistico-radicacion',
        component: EstadisticoRadicacion,
        canActivate: [PermisionsGuard],
        data: { permission: '0503' },
      },

      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesGerencialesRoutingModule {}
