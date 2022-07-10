import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from '../material.module';
import { EdaBoxModule } from './box/box.module';
import { EdaCard } from './card/card.component';
import { EdaFieldsModule } from './fields/fields.module';
import { EdaModal } from './modal/modal.component';
import { EdaProgressBar } from './progress-bar/progress-bar.component';
import { EdaTablesModule } from './tables/tables.module';

@NgModule({
  declarations: [EdaProgressBar, EdaCard, EdaModal],
  imports: [
    EdaFieldsModule,
    EdaBoxModule,
    EdaTablesModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
  ],
  exports: [
    EdaFieldsModule,
    EdaProgressBar,
    EdaBoxModule,
    EdaCard,
    EdaModal,
    EdaTablesModule,
  ],
})
export class ComponentsModule {}
