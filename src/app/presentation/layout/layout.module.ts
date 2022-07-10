import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { EdaExpansionModule } from './sidebar/expansion/expansion.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Sidebar } from './sidebar/sidebar.component';
import { Sidenav } from './sidebar/sidenav/sidenav.component';
import { Header, Logout } from './header/header.component';
import { Footer } from './footer/footer.component';
import { Layout } from './layout.component';

@NgModule({
  declarations: [Layout, Header, Logout, Footer, Sidebar, Sidenav],
  exports: [Layout],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    EdaExpansionModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class LayoutModule {}
