import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EdaBoxContainer } from './container/container.component';
import { EdaBoxForm } from './form/form.component';
import { EdaBox } from './box.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [EdaBoxContainer, EdaBoxForm, EdaBox],
  imports: [
    MatProgressBarModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    CommonModule,
  ],
  exports: [EdaBox, EdaBoxForm, EdaBoxContainer],
})
export class EdaBoxModule {}
