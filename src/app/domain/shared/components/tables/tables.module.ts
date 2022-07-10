import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { TablesTransformValuePipe } from './tables-transform-values.pipe';
import { TablesValueToComparePipe } from './tables-value-to-compare.pipe';
import { TablesFormatDatePipe } from './tables-format-date.pipe';
import { TablesSumValuesPipe } from './tables-sum-values.pipe';
import { EdaSimpleDialogTable } from './simple-dialog-table/simple-dialog-table.component';
import { EdaValuePerHour } from './value-per-hour/value-per-hour.component';
import { EdaDatatable } from './datatable/datatable.component';
import { EdaTopTable } from './top-table/top-table.component';

@NgModule({
  declarations: [
    TablesTransformValuePipe,
    TablesValueToComparePipe,
    TablesFormatDatePipe,
    TablesSumValuesPipe,
    EdaSimpleDialogTable,
    EdaValuePerHour,
    EdaDatatable,
    EdaTopTable,
  ],
  imports: [
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatButtonModule,
    MatOptionModule,
    MatDialogModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    TablesTransformValuePipe,
    TablesValueToComparePipe,
    TablesFormatDatePipe,
    TablesSumValuesPipe,
    EdaSimpleDialogTable,
    EdaValuePerHour,
    EdaDatatable,
    EdaTopTable,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
  ],
})
export class EdaTablesModule {}
