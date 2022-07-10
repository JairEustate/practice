import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { PermisionsGuard } from 'src/app/infrastructure/guards/permissions.guard';
import { ConceptosAdmision } from './conceptos-admision/conceptos-admision.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'conceptos-admision',
        component: ConceptosAdmision,
        canActivate: [PermisionsGuard],
        data: { permission: '0401' },
      },
      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturacionRoutingModule {}
