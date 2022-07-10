import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { PermisionsGuard } from 'src/app/infrastructure/guards/permissions.guard';
import { DesconfirmarEpicrisis } from './desconfirmar-epicrisis/desconfirmar-epicrisis.component';
import { InterconsultasPendientes } from './interconsultas-pendientes/interconsultas-pendientes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'desconfirmar-epicrisis',
        component: DesconfirmarEpicrisis,
        canActivate: [PermisionsGuard],
        data: { permission: '0301' },
      },
      {
        path: 'interconsultas-pendientes',
        component: InterconsultasPendientes,
        canActivate: [PermisionsGuard],
        data: { permission: '0302' },
      },
      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoriaClinicaRoutingModule {}
