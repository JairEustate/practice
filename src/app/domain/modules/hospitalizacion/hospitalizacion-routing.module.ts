import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { PermisionsGuard } from 'src/app/infrastructure/guards/permissions.guard';
import { CensoCamas } from './censo-camas/censo-camas.component';
import { CensoPacientes } from './censo-pacientes/censo-pacientes.component';
import { JornadaDietas } from './jornada-dietas/jornada-dietas.component';
import { RegistroJornadaDietas } from './registro-jornada-dietas/registro-jornada-dietas.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'censo-pacientes',
        component: CensoPacientes,
        canActivate: [PermisionsGuard],
        data: { permission: '0101' },
      },
      {
        path: 'jornada-dietas',
        component: JornadaDietas,
        canActivate: [PermisionsGuard],
        data: { permission: '0102' },
      },
      {
        path: 'registro-jornada-dietas',
        component: RegistroJornadaDietas,
        canActivate: [PermisionsGuard],
        data: { permission: '0103' },
      },
      {
        path: 'censo-camas',
        component: CensoCamas,
        canActivate: [PermisionsGuard],
        data: { permission: '0104' },
      },
      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalizacionRoutingModule {}
