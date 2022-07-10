import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'highcharts-spline',
  templateUrl: './spline.component.html',
  styleUrls: ['./spline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighchartsSpline implements OnInit {
  @Input() data: any = [];
  @Input() title: any = [];
  @Input() categories: any = [];
  public highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options | any;

  public ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'spline',
      },
      title: {
        text: this.title,
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories: this.categories,
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: true,
      },
      tooltip: {
        valueSuffix: '',
      },
      series: this.data,
    };
  }
}
