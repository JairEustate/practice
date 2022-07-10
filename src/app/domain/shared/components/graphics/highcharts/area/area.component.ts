import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'highcharts-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighchartsArea implements OnInit {
  @Input() data: any = [];
  @Input() title: any = [];
  public chartOptions: any = {};
  public Highcharts: any = Highcharts;

  public ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'area',
      },
      title: {
        text: this.title,
      },
      subtitle: {
        text: '',
      },
      tooltip: {
        split: true,
        valueSuffix: '',
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
      series: this.data,
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }
}
