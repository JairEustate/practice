import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as FileSaver from 'file-saver';
import { Store } from '@ngrx/store';
import * as JSZip from 'jszip';
import jsPDF from 'jspdf';
import { SabanasUciService } from '../../../balances-enfermeria/sabanas-uci/sabanas-uci.services';
import { ContextService } from 'src/app/infrastructure/redux/services/context.service';
import { ContextState } from 'src/app/infrastructure/redux/reducers/context.reducer';
import { TimerService } from 'src/app/application/services/timer.service';
import { RadicacionStore } from '../../radicacion.store';

@Component({
  selector: 'reporte-sabanas-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class ReporteSabanasPdf implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @ViewChild('content', { static: false }) el!: ElementRef;
  @Input() data: any = [];
  balanceAcumulado!: number;
  paciente!: any;
  estadisticas: any;
  glucometria: any;
  signos: any;
  liquidos: any;
  liquidosAdministrados: any;
  liquidosEliminados: any;
  gastoUrinario: any;
  perdidaInsensible: any;
  subgruposLiquidosPerdidos: any;
  context: any;
  marcaAgua: any;

  constructor(
    private _sabanasUciSvc: SabanasUciService,
    private _radicacionStore: RadicacionStore,
    private _rdxStore: Store<ContextState>,
    private _contextSvc: ContextService,
    private _timer: TimerService
  ) {
    this._rdxStore
      .select('context')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(context => {
        this.context = context;
      });
  }

  ngOnInit(): void {
    this.marcaAgua = this._contextSvc.selectMarcaAgua(this.context);
    let timeoutGeneratePdf = 0;
    let timeoutGenerateZip = 5000 * this.data.length;
    let zip = new JSZip();
    for (let i = 0; i < this.data.length; i++) {
      setTimeout(() => {
        this._radicacionStore.setStatusReporte(
          `Generando ${this._timer.formatDate(
            this.data[i].infoIngreso[0].FECHA_REGISTRO_ENF,
            2
          )}.pdf`
        );
        this.paciente = {
          CAMA: this.data[i].infoIngreso[0].CAMA,
          FECHA_REGISTRO_ENF: this._timer.formatDate(
            this.data[i].infoIngreso[0].FECHA_REGISTRO_ENF,
            4
          ),
          CONS_INGRESO: this.data[i].infoIngreso[0].CONS_INGRESO,
          GDENOMBRE: this.data[i].infoIngreso[0].GDENOMBRE,
          GPANOMCOM: this.data[i].infoIngreso[0].GPANOMCOM,
          GRUPO_CAMA: this.data[i].infoIngreso[0].GRUPO_CAMA,
          OID: this.data[i].infoIngreso[0].OID,
          PACNUMDOC: this.data[i].infoIngreso[0].PACNUMDOC,
          PESO: this.data[i].infoIngreso[0].PESO,
        };
        this.subgruposLiquidosPerdidos =
          this._sabanasUciSvc.getSubgruposLiquidosPerdidos();
        this.liquidosAdministrados = this.data[i].balanceLiquidos.liquidosAdministrados;
        this.liquidosEliminados = this.data[i].balanceLiquidos.totalLiquidosEliminados;
        this.balanceAcumulado = this.data[i].balanceLiquidos.balanceAcumulado;
        this.gastoUrinario = this.data[i].balanceLiquidos.gastoUrinario;
        this.perdidaInsensible = this.data[i].balanceLiquidos.perdidaInsensible;
        this.glucometria = this.data[i].glucometria;
        this.signos = this._sabanasUciSvc.addUndocumentHours(
          this.data[i].signos,
          'signo',
          'resultados',
          'hora'
        );
        this.liquidos = this._sabanasUciSvc.addUndocumentHours(
          this.data[i].liquidos,
          'liquido',
          'resultado',
          'hora'
        );
        setTimeout(() => {
          let pdf = new jsPDF('l', 'pt', 'a4');
          pdf.html(this.el.nativeElement, {
            callback: pdf => {
              zip.file(
                `${this._timer.formatDate(
                  this.data[i].infoIngreso[0].FECHA_REGISTRO_ENF,
                  2
                )}.pdf`,
                pdf.output('blob')
              );
            },
          });
        }, 500);
      }, timeoutGeneratePdf);
      timeoutGeneratePdf += 5000;
    }

    setTimeout(() => {
      let today = this._timer.dateForFiles();
      this._radicacionStore.setStatusReporte('Generando archivo comprimido');
      zip.generateAsync({ type: 'blob' }).then(function (content: any) {
        FileSaver.saveAs(content, `${today}.zip`);
      });
      setTimeout(() => {
        this._radicacionStore.setStatusReporte('No hay reportes pendientes');
      }, 3000);
    }, timeoutGenerateZip);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
