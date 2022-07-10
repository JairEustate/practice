import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private _timer: TimerService) {}

  /**
   * Generates pdf file in horizontal sheet size A4.
   * @param nativeElement
   * @returns
   */
  generatePdfHorizontalA4(nativeElement: any, name: string = 'pdf') {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.html(nativeElement, {
      callback: pdf => {
        return pdf.save(`${name + this._timer.dateForFiles()}.pdf`);
      },
    });
  }
}
