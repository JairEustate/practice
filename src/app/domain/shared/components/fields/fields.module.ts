import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EdaDateRangeField } from './date-range-field/date-range-field.component';
import { EdaPasswordField } from './password-field/password-field.component';
import { EdaSelectField } from './select-field/select-field.component';
import { EdaNumberField } from './number-field/number-field.component';
import { EdaFilterField } from './filter-field/filter-field.component';
import { EdaMoneyField } from './money-field/money-field.component';
import { EdaDateField } from './date-field/date-field.component';
import { EdaTextField } from './text-field/text-field.component';
import { EdaCustomError } from './custom-error/error.component';
import { EqualsPipe } from './custom-error/equals.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  EdaMonthField,
  EdaMonthModal,
} from './custom-date-range-field/month-field/month-field.component';
import {
  EdaYearField,
  EdaYearModal,
} from './custom-date-range-field/year-field/year-field.component';

@NgModule({
  declarations: [
    EdaMonthModal,
    EdaYearModal,
    EdaMonthField,
    EdaYearField,
    EdaDateRangeField,
    EdaPasswordField,
    EdaFilterField,
    EdaSelectField,
    EdaCustomError,
    EdaNumberField,
    EdaMoneyField,
    EdaTextField,
    EdaDateField,
    EqualsPipe,
  ],
  imports: [
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    EdaDateRangeField,
    EdaPasswordField,
    EdaFilterField,
    EdaNumberField,
    EdaSelectField,
    EdaMoneyField,
    EdaTextField,
    EdaDateField,
    EdaMonthField,
    EdaYearField,
  ],
})
export class EdaFieldsModule {}
