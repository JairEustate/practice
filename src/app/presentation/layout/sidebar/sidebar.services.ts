import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public toggle(): void {
    const sidebar: any = document.getElementById('sidebar');
    const wrapper: any = document.getElementById('wrapper');
    const toggleButtonOverBody: any = document.getElementById('toggle-button-over-body');
    sidebar?.classList.toggle('active');
    wrapper?.classList.toggle('active');
    toggleButtonOverBody?.classList.toggle('show-toggle-button-over-body');
    const hideOnSidebarClosed: any = document.getElementsByClassName(
      'hide-on-sidebar-closed'
    );
    for (let i = 0; i < hideOnSidebarClosed.length; i++) {
      if (sidebar?.classList.contains('mid-hidden')) {
        if (sidebar?.classList.contains('active')) {
          setTimeout(() => {
            hideOnSidebarClosed[i].classList.remove('hidden');
          }, 220);
        } else {
          hideOnSidebarClosed[i].classList.add('hidden');
        }
      }
    }
    this._ajustarGraficasEstadisticoPfgp();
  }

  private _ajustarGraficasEstadisticoPfgp(): void {
    try {
      document.getElementById('ajustar-graficas')?.click();
    } catch (error) {}
  }
}
