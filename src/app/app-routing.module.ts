import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KEYWORD_LAYOUT } from './app.navigation';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { GuestGuard } from './infrastructure/guards/guest.guard';

const routes: Routes = [
  { path: '', redirectTo: `${KEYWORD_LAYOUT}/dashboard`, pathMatch: 'full' },
  {
    path: `${KEYWORD_LAYOUT}/dashboard`,
    loadChildren: () =>
      import('./domain/modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: `${KEYWORD_LAYOUT}/seguridad`,
    loadChildren: () =>
      import('./domain/modules/seguridad/seguridad.module').then(m => m.SeguridadModule),
    canActivate: [AuthGuard],
    data: { preload: true },
  },
  {
    path: 'session',
    loadChildren: () =>
      import('./domain/modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard],
  },
  { path: '**', redirectTo: `${KEYWORD_LAYOUT}/dashboard`, pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
