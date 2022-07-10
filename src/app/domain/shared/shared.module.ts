import { ComponentsModule } from './components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    MaterialModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    MaterialModule,
    CommonModule,
    FormsModule,
  ],
})
export class SharedModule {}
