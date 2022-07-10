import { ChangeDetectionStrategy, Component } from '@angular/core';
import { appInfo } from 'src/app/app.information';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  public appInfo = appInfo;

  public contextName: string = localStorage.getItem('ContextName')!;
}
