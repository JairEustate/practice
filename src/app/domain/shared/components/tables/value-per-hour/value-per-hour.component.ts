import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'eda-value-per-hour-table',
  templateUrl: './value-per-hour.component.html',
  styleUrls: ['./value-per-hour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaValuePerHour {
  @Input() data: any = [];

  @Input() addWarningClass: any = ['exampleTitleNoExist'];

  @Input() valueName: string = 'Hour';

  @Input() hasTooltip: boolean = false;

  @Input() value: string = 'hour';

  @Input() resultName: string = 'Result';

  @Input() result: string = 'result';

  constructor() {}
}
