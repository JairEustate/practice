import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { PermisionsGuard } from 'src/app/infrastructure/guards/permissions.guard';
import { Conciliacion } from './conciliacion/conciliacion.component';
import { Gestion } from './gestion/gestion.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'gestion',
        component: Gestion,
        canActivate: [PermisionsGuard],
        data: { permission: '0701' },
      },
      {
        path: 'conciliacion',
        component: Conciliacion,
        canActivate: [PermisionsGuard],
        data: { permission: '0702' },
      },
      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarteraRoutingModule {}
