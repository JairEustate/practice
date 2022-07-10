import {
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Component,
} from '@angular/core';

@Component({
  selector: 'eda-accordion',
  template: `
    <div #accordion>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./expansion-module.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaAccordion implements AfterViewInit {
  @ViewChild('accordion') accordion: ElementRef | any;

  public ngAfterViewInit(): void {
    // Add class 'eda-accordion' to all elements that contains
    // the class eda-expansion-panel.
    const expansionPanels =
      this.accordion.nativeElement.querySelectorAll('.eda-expansion-panel');
    expansionPanels.forEach(
      (expansionPanel: { classList: { add: (arg0: string) => void } }) => {
        expansionPanel.classList.add(`eda-accordion`);
      }
    );
    // Add class 'eda-accordion' to all elements that contains
    // the class eda-expansion-panel-header.
    const expansionPanelHeaders = this.accordion.nativeElement.querySelectorAll(
      '.eda-expansion-panel-header'
    );
    expansionPanelHeaders.forEach(
      (expansionPanelHeader: { classList: { add: (arg0: string) => void } }) => {
        expansionPanelHeader.classList.add(`eda-accordion`);
      }
    );
    this._subscribeToExpansionPanels(expansionPanels);
  }
  /**
   * Execute an action on click in expansion panel.
   * @param expansionPanels
   */
  private _subscribeToExpansionPanels(expansionPanels: any): void {
    expansionPanels.forEach((expansionPanel: any) => {
      expansionPanel.addEventListener('click', () => {
        this._activeAccordionMode(expansionPanel);
        // Add or remove 'active' class for the expansion panel selected.
        expansionPanel.classList.toggle('active');
        try {
          // Select the currently active expansion-panel and add 'active' class to
          // the expansion panel header.
          const currentlyActiveExpansionPanel: any =
            this.accordion.nativeElement.querySelector('.eda-expansion-panel.active');
          currentlyActiveExpansionPanel
            .querySelector('.eda-expansion-panel-header')
            .classList.toggle('active');
        } catch (error) {
          // If you click again in the currently active expansion panel, there is not
          // some expansion panel with 'active' class. In that case, remove 'active'
          // class from all expansion panel headers.
          const expansionPanelHeaders = this.accordion.nativeElement.querySelectorAll(
            '.eda-expansion-panel-header'
          );
          expansionPanelHeaders.forEach((expansionPanelHeader: any) => {
            expansionPanelHeader.classList.remove('active');
          });
        }

        // Expand or collapse the expansion panel body depending on whether or not it
        // contains the 'active' class.
        const expansionPanelBody: any = expansionPanel.nextElementSibling;
        if (expansionPanel.classList.contains('active')) {
          expansionPanelBody.style.maxHeight = expansionPanelBody.scrollHeight + 'px';
        } else {
          expansionPanelBody.style.maxHeight = 0;
        }
      });
    });
  }
  /**
   * Close any expansion panel active if it is not the selected.
   * @param expansionPanel
   */
  private _activeAccordionMode(expansionPanel: any): void {
    const currentlyActiveExpansionPanel: any = this.accordion.nativeElement.querySelector(
      '.eda-expansion-panel.active'
    );
    if (
      currentlyActiveExpansionPanel &&
      currentlyActiveExpansionPanel !== expansionPanel
    ) {
      currentlyActiveExpansionPanel
        .querySelector('.eda-expansion-panel-header')
        .classList.toggle('active');
      currentlyActiveExpansionPanel.classList.toggle('active');
      currentlyActiveExpansionPanel.nextElementSibling.style.maxHeight = 0;
    }
  }
}
