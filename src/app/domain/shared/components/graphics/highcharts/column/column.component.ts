import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'highcharts-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighchartsColumn implements OnInit {
  @Input() data = [];
  @Input() title: any = [];
  @Input() categories: any = [];
  public highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options | any;

  public ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: this.title,
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        categories: this.categories,
        crosshair: true,
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
        },
      },
      tooltip: {
        headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:,.f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: this.data,
    };
  }
}
