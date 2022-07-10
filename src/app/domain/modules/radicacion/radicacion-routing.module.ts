import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { PermisionsGuard } from 'src/app/infrastructure/guards/permissions.guard';
import { ReporteSabanas } from './reporte-sabanas/reporte-sabanas.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reporte-sabanas',
        component: ReporteSabanas,
        canActivate: [PermisionsGuard],
        data: { permission: '0601' },
      },
      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadicacionRoutingModule {}
