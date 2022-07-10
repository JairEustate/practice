import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { defaultAppearanceMatForm } from '../fields.common';

@Component({
  selector: 'eda-date-range-field',
  templateUrl: './date-range-field.component.html',
  styleUrls: ['./date-range-field.component.scss'],
})
export class EdaDateRangeField implements OnInit {
  @Input() startPlaceholder: string = 'Inicio';
  @Input() endPlaceholder: string = 'Fin';
  @Input() appearance: any = defaultAppearanceMatForm;
  @Input() color: string = 'primary';
  @Input() label: string = 'label';
  @Input() start!: FormControl;
  @Input() end!: FormControl;
  public required: boolean = false;

  public ngOnInit(): void {
    const start: any = this.start;
    const end: any = this.end;
    if (start._rawValidators) {
      start._rawValidators.map((r: any) => {
        if (r.name.includes('required')) {
          this.required = true;
        }
      });
    }
    if (end._rawValidators) {
      end._rawValidators.map((r: any) => {
        if (r.name.includes('required')) {
          this.required = true;
        }
      });
    }
  }
}
