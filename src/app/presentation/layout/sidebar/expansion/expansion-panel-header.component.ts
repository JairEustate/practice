import {
  ChangeDetectionStrategy,
  ElementRef,
  Component,
  ViewChild,
  Input,
} from '@angular/core';

@Component({
  selector: 'eda-expansion-panel-header',
  template: `
    <button
      [class]="'eda-expansion-panel-header ' + class"
      [style]="style"
      #expansionPanelHeader
      (click)="toggle()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./expansion-module.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaExpansionPanelHeader {
  @ViewChild('expansionPanelHeader') expansionPanelHeader!: ElementRef;

  @Input() style: string = '';

  @Input() class: string = '';

  public toggle(): void {
    const expansionPanelHeader = this.expansionPanelHeader?.nativeElement;
    //Execute ONLY if the element IS'NT wrapped by eda-accordion component.
    if (!expansionPanelHeader.classList.contains('eda-accordion')) {
      expansionPanelHeader.classList.toggle('active');
    }
  }
}
