import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from 'src/app/app.navigation';
import { Dashboard } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: Dashboard },
      { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard` },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
