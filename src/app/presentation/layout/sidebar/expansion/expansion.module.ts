import { NgModule } from '@angular/core';
import { EdaExpansionPanelHeader } from './expansion-panel-header.component';
import { EdaExpansionPanel } from './expansion-panel.component';
import { EdaAccordion } from './accordion.component';

@NgModule({
  declarations: [
    EdaExpansionPanelHeader,
    EdaExpansionPanel,
    EdaAccordion,
  ],
  exports: [
    EdaExpansionPanelHeader,
    EdaExpansionPanel,
    EdaAccordion,
  ],
})
export class EdaExpansionModule {}
