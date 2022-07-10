import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'highcharts-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighchartsPie implements OnInit {
  @Input() title: any;
  @Input() data: any = [];
  public Highcharts = Highcharts;
  public chartOptions = {};

  public ngOnInit(): void {
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: this.title,
      },
      tooltip: {
        pointFormat: '<b>{series.name}:</b>{point.y:,.0f}</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> {point.percentage:.1f}%',
          },
        },
      },
      exporting: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Total',
          colorByPoint: true,
          data: this.data,
        },
      ],
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }
}
