import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EdaModal } from 'src/app/domain/shared/components/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}
  /**
   * alert tipo confirm creado con Material, subscribirse
   * para obtener resultados.
   * @param title
   * @param content
   * @returns boolean
   */
  confirm(content: string, title: string = '') {
    const dialog = this.dialog.open(EdaModal, {
      width: '250px',
      data: { title: title, content: content, type: 'confirm' },
    });
    return dialog.afterClosed();
  }
  /**
   * alerta simple para notificaciones creada con Material,
   * subscribirse para obtener resultados.
   * @param title
   * @param content
   */
  alert(content: string, title: string = ''): Observable<boolean> {
    const dialog = this.dialog.open(EdaModal, {
      width: '250px',
      data: { title: title, content: content, type: 'alert' },
    });
    return dialog.afterClosed();
  }
}
