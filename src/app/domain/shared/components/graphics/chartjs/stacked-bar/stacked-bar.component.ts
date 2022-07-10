import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export interface barChartDataI {
  data: string[] | number[];
  label: string;
  stack: string;
}

@Component({
  selector: 'stacked-bar-chartjs',
  templateUrl: './stacked-bar.component.html',
  styleUrls: ['./stacked-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartjsStackedBar implements OnInit {
  @Input() description!: string;
  @Input() labels: any;
  @Input() data: any;

  public ngOnInit(): void {
    // let count = 0;
    this.data.map((r: any) => {
      r.lineTension = 0.5;
      r.radius = 3;
      r.fill = true;
      /* if (count === 0) {
        r.backgroundColor = "#0aa1ae85";
        r.hoverBackgroundColor = "#0aa1ae";
        r.borderColor = "#07717a";
        r.pointBorderColor = "#0aa1ae";
      } else if (count === 1) {
        r.backgroundColor = "#077a4085";
        r.hoverBackgroundColor = "#077a40";
        r.borderColor = "#065f33";
        r.pointBorderColor = "#077a40";
      } else if (count === 2) {
        r.backgroundColor = "#779e0c85";
        r.hoverBackgroundColor = "#779e0c";
        r.borderColor = "#557009";
        r.pointBorderColor = "#779e0c";
      }
      count++;*/
    });
  }

  barChartOptions: {} = {
    responsive: true,
  };
  barChartLegend = false;
}
