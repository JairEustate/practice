import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { PermisionsGuard } from 'src/app/infrastructure/guards/permissions.guard';
import { AsignarPermisos } from './asignar-permisos/asignar-permisos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'asignar-permisos',
        component: AsignarPermisos,
        canActivate: [PermisionsGuard],
        data: { permission: '0901' },
      },
      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeguridadRoutingModule {}
