import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { PermisionsGuard } from 'src/app/infrastructure/guards/permissions.guard';
import { SabanasUci } from './sabanas-uci/sabanas-uci.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sabanas-uci',
        component: SabanasUci,
        canActivate: [PermisionsGuard],
        data: { permission: '0201' },
      },
      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BalancesEnfermeriaRoutingModule {}
