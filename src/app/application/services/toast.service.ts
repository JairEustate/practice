import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private _snackBar: MatSnackBar) {}
  /**
   * Generate toast with the received message as parameter.
   * @param message
   * @param dismissButton
   * @param dismissMsg
   * @param duration
   */
  notification(
    message: string,
    dismissButton: boolean = false,
    dismissMsg: string = 'Dismiss',
    duration: number = 3000
  ): void {
    this.generateMatToast(
      message,
      dismissButton,
      dismissMsg,
      duration,
      'snackbar-notification'
    );
  }

  private generateMatToast(
    message: string,
    dismissButton: boolean,
    dismissMsg: string,
    duration: number,
    type: string
  ) {
    this._snackBar.open(message, `${dismissButton ? dismissMsg : ''}`, {
      duration: duration,
      panelClass: type,
    });
  }
}
