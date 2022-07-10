import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'eda-box-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaBoxContainer {
  @Input() class: string = '';
  @Input() style: string = '';

  constructor() {}
}
