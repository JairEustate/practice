import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Chart, ChartItem } from 'chart.js';

@Component({
  selector: 'donut-chartjs',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartjsDonut implements AfterViewInit {
  @Input() description!: string;
  @Input() labels: any;
  @Input() data: any;
  public id: string = (Math.floor(Math.random() * (999 - 111)) + 111).toString();

  public ngAfterViewInit(): void {
    let data: any,
      options: any,
      chart: any,
      ctx: ChartItem | any = document.getElementById(this.id) as HTMLElement;

    data = this.data;
    options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
      },
    };

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });
  }
}
