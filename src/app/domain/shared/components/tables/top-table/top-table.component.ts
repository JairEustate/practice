import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'eda-top-table',
  templateUrl: './top-table.component.html',
  styleUrls: ['./top-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaTopTable implements OnInit {
  @Input() name: string = '';
  @Input() description: string = '';

  constructor() {}

  ngOnInit(): void {}
}
