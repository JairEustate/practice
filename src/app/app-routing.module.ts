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
    path: `${KEYWORD_LAYOUT}/balances-enfermeria`,
    loadChildren: () =>
      import('./domain/modules/balances-enfermeria/balances-enfermeria.module').then(
        m => m.BalancesEnfermeriaModule
      ),
    canActivate: [AuthGuard],
    data: { preload: true },
  },
  {
    path: `${KEYWORD_LAYOUT}/hospitalizacion`,
    loadChildren: () =>
      import('./domain/modules/hospitalizacion/hospitalizacion.module').then(
        m => m.HospitalizacionModule
      ),
    canActivate: [AuthGuard],
    data: { preload: true },
  },
  {
    path: `${KEYWORD_LAYOUT}/historia-clinica`,
    loadChildren: () =>
      import('./domain/modules/historia-clinica/historia-clinica.module').then(
        m => m.HistoriaClinicaModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: `${KEYWORD_LAYOUT}/facturacion`,
    loadChildren: () =>
      import('./domain/modules/facturacion/facturacion.module').then(
        m => m.FacturacionModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: `${KEYWORD_LAYOUT}/informes-gerenciales`,
    loadChildren: () =>
      import('./domain/modules/informes-gerenciales/informes-gerenciales.module').then(
        m => m.InformesGerencialesModule
      ),
    canActivate: [AuthGuard],
    data: { preload: true },
  },
  {
    path: `${KEYWORD_LAYOUT}/radicacion`,
    loadChildren: () =>
      import('./domain/modules/radicacion/radicacion.module').then(
        m => m.RadicacionModule
      ),
    canActivate: [AuthGuard],
    data: { preload: true },
  },
  {
    path: `${KEYWORD_LAYOUT}/cartera`,
    loadChildren: () =>
      import('./domain/modules/cartera/cartera.module').then(m => m.CarteraModule),
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
