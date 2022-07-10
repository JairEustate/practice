import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
  Component,
  ViewChild,
  Input,
} from '@angular/core';

@Component({
  selector: 'eda-expansion-panel',
  template: `
    <div class="eda-expansion-panel-container">
      <div [class]="'eda-expansion-panel ' + class" [style]="style" #expansionPanelHeader>
        <ng-content select="eda-expansion-panel-header"></ng-content>
      </div>
      <div class="eda-expansion-panel-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./expansion-module.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaExpansionPanel implements AfterViewInit {
  @ViewChild('expansionPanelHeader') expansionPanelHeader!: ElementRef;

  @Input() style: string = '';

  @Input() class: string = '';

  constructor(private _cd: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    const expansionPanelHeader = this.expansionPanelHeader?.nativeElement;
    setTimeout(() => {
      //Execute ONLY if the element IS'NT wrapped by eda-accordion component.
      if (!expansionPanelHeader.classList.contains('eda-accordion')) {
        expansionPanelHeader.addEventListener('click', () => {
          expansionPanelHeader.classList.toggle('active');
          const accordionItemBody: any = expansionPanelHeader.nextElementSibling;
          if (expansionPanelHeader.classList.contains('active')) {
            accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + 'px';
          } else {
            accordionItemBody.style.maxHeight = 0;
          }
        });
      }
      this._cd.markForCheck();
    }, 100);
  }
}
