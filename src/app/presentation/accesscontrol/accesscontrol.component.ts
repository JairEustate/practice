import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { appInfoI, appInfo } from 'src/app/app.information';

@Component({
  selector: 'app-accesscontrol',
  templateUrl: './accesscontrol.component.html',
  styleUrls: ['./accesscontrol.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accesscontrol implements OnInit, OnDestroy {
  app: appInfoI = appInfo;

  constructor(private _title: Title) {}

  public ngOnInit(): void {
    this._title.setTitle('Eklipse | Accesscontrol');
    document.getElementById('body')?.classList.add('accesscontrol');
  }

  public ngOnDestroy(): void {
    document.getElementById('body')?.classList.remove('accesscontrol');
  }
}
