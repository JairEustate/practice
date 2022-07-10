import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PdfService } from 'src/app/application/services/pdf.service';
import { TimerService } from 'src/app/application/services/timer.service';

@Component({
  selector: 'jornada-dietas-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class JornadaDietasPdf implements OnInit {
  constructor(private _timer: TimerService, private pdf: PdfService) {}

  @ViewChild('content', { static: false }) el!: ElementRef;
  @Input() dataSource: any;
  @Input() displayedColumns: any;
  @Input() columnNames: any;
  @Input() title: any;
  @Input() date: any;
  @Input() isCatalogo: any;
  @Input() combinaciones: any;
  public today: any = this._timer.formatDate(new Date(), 2);
  public displayedColumnsCombinaciones: any;
  public columnNamesCombinaciones: any;

  public ngOnInit(): void {
    if (!this.isCatalogo) {
      this.displayedColumnsCombinaciones = ['CANTIDAD', 'TIPO', 'CONSISTENCIA', 'VALOR'];
      this.columnNamesCombinaciones = ['Cantidad', 'Tipo', 'Consistencia', 'Valor'];
    }
    setTimeout(() => {
      this.generatePdf();
    }, 1000);
  }

  public generatePdf(): void {
    let name;
    if (this.isCatalogo) {
      name = 'reporte_catalogo';
    } else {
      name = 'reporte_jornada';
    }
    this.pdf.generatePdfHorizontalA4(this.el.nativeElement, name);
  }
}
