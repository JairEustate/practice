import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'eda-filter-field',
  templateUrl: './filter-field.component.html',
  styleUrls: ['./filter-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaFilterField {
  @Input() class: string = '';
  @Input() style: string = '';
  @Output() event = new EventEmitter<string>();
  public searchKey!: string;

  public onKeyup() {
    this.event.emit(this.searchKey);
  }

  public onSearchClear(): void {
    this.searchKey = '';
    this.event.emit('');
  }
}
