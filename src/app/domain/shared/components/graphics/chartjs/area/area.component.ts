import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Chart, ChartItem } from 'chart.js';

@Component({
  selector: 'area-chartjs',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartjsArea implements AfterViewInit {
  @Input() description!: string;
  @Input() labels: any;
  @Input() data: any;
  public id: string = (Math.floor(Math.random() * (999 - 111)) + 111).toString();
  //https://stackblitz.com/edit/angular-8-area-chart?file=src%2Fapp%2Fapp.component.html

  public ngAfterViewInit(): void {
    let data: any,
      options: any,
      chart: any,
      ctx: ChartItem | any = document.getElementById(this.id) as HTMLElement;

    //  let count = 0;
    this.data.map((r: any) => {
      r.lineTension = 0.5;
      r.radius = 3;
      r.fill = true;
      /* if (count === 0) {
        r.backgroundColor = "#0aa1ae85";
        r.borderColor = "#07717a";
        r.pointBorderColor = "#0aa1ae";
        r.pointHoverBorderColor = "#0aa1ae";
        r.pointBackgroundColor = "#0aa1ae";
        r.pointHoverBackgroundColor = "#0aa1ae";
      } else if (count === 1) {
        r.backgroundColor = "#077a4085";
        r.borderColor = "#065f33";
        r.pointBorderColor = "#077a40";
        r.pointHoverBorderColor = "#077a40";
        r.pointBackgroundColor = "#077a40";
        r.pointHoverBackgroundColor = "#077a40";
      } else if (count === 2) {
        r.backgroundColor = "#779e0c85";
        r.borderColor = "#557009";
        r.pointBorderColor = "#779e0c";
        r.pointHoverBorderColor = "#779e0c";
        r.pointBackgroundColor = "#779e0c";
        r.pointHoverBackgroundColor = "#779e0c";
      }
      count++;*/
    });

    data = {
      labels: this.labels,
      datasets: this.data,
    };

    options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: false,
          position: 'top',
          text: 'Area Chartjs',
          fontSize: 12,
          fontColor: '#666',
        },
        legend: {
          display: false,
        },
      },
    };

    chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options,
    });
  }
}
