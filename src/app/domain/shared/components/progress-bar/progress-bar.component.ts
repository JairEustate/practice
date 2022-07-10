import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SIDENAV } from 'src/app/app.navigation';
@Component({
  selector: 'eda-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaProgressBar implements OnInit {
  public navigation: any = SIDENAV;

  public linksArray: any = [];

  public data: any = [];

  public imageExist: boolean = false;

  public ext1 = 'solicitando ';

  public ext2 = ' de la plataforma';

  public ngOnInit(): void {
    this.navigation.map((r: any) => {
      if (r.type === 'accordion') {
        this.linksArray.push(r.routes);
      } else if (r.type === 'link') {
        this.linksArray.push([r.routes]);
      }
    });
    this.linksArray.map((r: any) => {
      for (let i of r) {
        if (i !== undefined) {
          if (window.location.href.includes(i.route)) {
            this.data = i;
            this.imageExist = true;
          }
        }
      }
    });
  }
}
