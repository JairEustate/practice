import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { CentroAtencionI } from 'src/app/application/interfaces/centro-atencion.interface';
import { ApiService } from 'src/app/application/services/api.service';
import { TimerService } from 'src/app/application/services/timer.service';

enum contratosE {
  _8001 = '8001',
  _8009 = '8009',
  _8010 = '8010',
  _ASMET = 'ASMET',
  _8003_8004 = '8003 - 8004',
  _I202 = 'I202',
}

@Component({
  selector: 'pfgp-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticoPfgpGraficas implements OnInit {
  @Input() inicioReporte: any;
  @Input() finalReporte: any;
  @Input() isActualMonth: any;
  @Input() isLastMonth: any;
  @Input() centrosAtencion: CentroAtencionI[] = [];
  @Input() context!: string;

  private _id1!: number;
  private _id2!: number;

  public graficasTitle: string = 'Facturado';
  public showFacturado: boolean = false;
  public showAcostado: boolean = true;
  //getConsumidoFacturado();
  public dataConsumidoFacturado: any;
  public categoriasConsumidoFacturado: any;
  public showConsumidoFacturado: boolean = false;
  //getConsumidoAcostado()
  public dataConsumidoAcostado: any[] = [];
  public showConsumidoAcostado: boolean = false;
  public dataTotalCargado: any[] = [];
  public showTotalCargado: boolean = false;
  public dataFactEjecAcost: any;
  public categoriasFactEjecAcost: any[] = [];
  public showFactEjecAcost: boolean = false;
  //getTotalConsumidoDiario()
  public dataConsumidoDiario: any[] = [];
  public categoriasConsumidoDiario: any[] = [];
  public showConsDiaG1: boolean = false;
  public showConsDiaG2: boolean = false;
  public showConsDiaG3: boolean = false;
  //getConsumidoDiarioAcostado()
  public dataConsumidoDiarioAcostado: any[] = [];
  public categoriasConsumidoDiarioAcostado: any[] = [];
  public showConsumidoDiarioAcostado: boolean = false;
  //getAgrupadoresNuevaEps();
  public dataAgrupadoresNuevaEPS: any[] = [];
  public showAgrupadoresNuevaEps: boolean = false;
  //getAgrupadoresASMET();
  public dataAgrupadoresASMET: any[] = [];
  public showAgrupadoresASMET: boolean = false;

  public updatingAll: boolean = false;
  public disableBtnUpd: boolean = false;

  public diasSeleccionados!: number;

  constructor(
    private _cd: ChangeDetectorRef,
    private _timer: TimerService,
    private _api: ApiService
  ) {}

  public ngOnInit(): void {
    this._id1 = this.centrosAtencion[0].id;
    if (this.centrosAtencion.length === 1) {
      this._id2 = this.centrosAtencion[0].id;
    } else {
      this._id2 = this.centrosAtencion[1].id;
    }
    if (!this.isActualMonth && !this.isLastMonth) {
      this.showFacturado = true;
      this.showAcostado = false;
    }
    this.getConsumidoFacturado();
    this.getAgrupadores();
    this.getTotalConsumidoDiario();
    if (this.isActualMonth || this.isLastMonth) {
      this.getConsumidoAcostado();
      this.getConsumidoDiarioAcostado();
      this.showFacturado = true;
      this.showAcostado = false;
    }
  }

  public actualizar(): void {
    this.disableBtnUpd = true;
    const acost = this.showAcostado;
    const fact = this.showFacturado;
    this.updatingAll = true;
    this.showFacturado = false;
    this.showAcostado = false;
    setTimeout(() => {
      this.updatingAll = false;
      this.showFacturado = true;
      this.showAcostado = true;
      if (!acost) {
        this.showAcostado = false;
      }
      if (!fact) {
        this.showFacturado = false;
      }
      this.disableBtnUpd = false;
      this._cd.markForCheck();
    }, 500);
  }

  public getAgrupadores(): void {
    let contrato: any;
    if (this.context === 'ALTA-CENTRO') {
      contrato = '8001';
    }
    if (this.context === 'VALLEDUPAR') {
      contrato = 'I202';
    }
    this.getAgrupadoresNuevaEps(contrato);
    this.getAgrupadoresASMET();
  }

  public getConsumidoFacturado(): void {
    const url = `pgp/consumido-facturado?fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}&centro1=${this._id1}&centro2=${this._id2}`;
    this._api.get(url).subscribe(res => {
      if (res.success === true) {
        let arrayEjecutado: any[] = [];
        let arrayFacturado: any[] = [];
        let arrayCategorias: any[] = [];
        let consumidoFacturado: any[] = [];
        res.data.map((r: any) => {
          arrayEjecutado.push(r.TotalEjecutado);
          arrayFacturado.push(r.TotalFacturado);
          arrayCategorias.push(r.Contrato);
          consumidoFacturado.push({
            NContrato: r.NContrato,
            contrato: r.Contrato,
            contratado: r.TotalFacturado,
          });
        });
        this.generateTechoRegServDia(consumidoFacturado);
        this.categoriasConsumidoFacturado = arrayCategorias;
        this.dataConsumidoFacturado = [
          { name: 'Facturado', data: arrayEjecutado },
          { name: 'Contratado', data: arrayFacturado },
        ];
        this.showConsumidoFacturado = true;
        this._cd.markForCheck();
      }
    });
  }

  public getTotalConsumidoDiario(): void {
    let contrato: any;
    let contratoASMET: any;
    if (this.context === 'ALTA-CENTRO') {
      contrato = contratosE._8001;
      contratoASMET = contratosE._8001;
    }
    if (this.context === 'VALLEDUPAR') {
      contrato = contratosE._I202;
    }
    if (this.context === 'AGUACHICA') {
      contrato = contratosE._8003_8004;
      contratoASMET = contratosE._8003_8004;
    }

    if (this.context === 'ALTA-CENTRO' || this.context === 'VALLEDUPAR') {
      const url = `pgp/consumidodiario?fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}&contrato=${contrato}`;
      this._api.get(url).subscribe(res => {
        if (res.success) {
          let data: any[] = [];
          this.diasSeleccionados = res.data.length;
          res.data.map((r: any) => {
            data.push(Math.round(r.TotalEjecutado));
            this.categoriasConsumidoDiario.push(Math.round(r.Dia));
          });
          this.dataConsumidoDiario.push({
            name: 'Nueva EPS',
            data: data,
          });
          this.showConsDiaG1 = true;
          this._cd.markForCheck();
        }
      });
    } else {
      this.showConsDiaG1 = true;
      this._cd.markForCheck();
    }

    if (this.context === 'ALTA-CENTRO' || this.context === 'AGUACHICA') {
      const url = `pgp/consumidodiarioAsmet?fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}&contrato=${contratoASMET}`;
      this._api.get(url).subscribe(res => {
        if (res.success === true) {
          let data: any[] = [];
          res.data.map((r: any) => {
            data.push(Math.round(r.TotalEjecutado));
          });
          this.dataConsumidoDiario.push({
            name: 'ASMET Salud',
            data: data,
          });
          this.showConsDiaG2 = true;
          this._cd.markForCheck();
        }
      });
    } else {
      this.showConsDiaG2 = true;
      this._cd.markForCheck();
    }
  }

  public getConsumidoAcostado(): void {
    let url = '';
    if (this.isActualMonth) {
      url = `pgp/consumido-acostado?centro1=${this._id1}&centro2=${this._id2}`;
    }
    if (this.isLastMonth) {
      url = `pgp/consumido-acostado-antiguo?centro1=${this._id1}&centro2=${this._id2}`;
    }
    this._api.get(url).subscribe(res => {
      if (res.success) {
        res.data.map((r: any) => {
          this.dataConsumidoAcostado.push({
            name: r.Contrato,
            y: r.Iteraciones,
          });
        });
        this.showConsumidoAcostado = true;
        this._cd.markForCheck();
        res.data.map((r: any) => {
          this.dataTotalCargado.push({
            name: r.Contrato,
            y: r.TotalEjecutado,
          });
        });
        this.showTotalCargado = true;
        this._cd.markForCheck();
        let arrayEjecutado: any[] = [];
        let arrayFacturado: any[] = [];
        let arrayCategorias: any[] = [];
        res.data.map((r: any) => {
          arrayEjecutado.push(r.TotalEjecutado);
          arrayFacturado.push(r.TotalFacturado);
          arrayCategorias.push(r.Contrato);
        });
        this.categoriasFactEjecAcost = arrayCategorias;
        this.dataFactEjecAcost = [
          { name: 'Ejecutado', data: arrayEjecutado },
          { name: 'Facturado', data: arrayFacturado },
        ];
        this.showFactEjecAcost = true;
        this._cd.markForCheck();
      }
    });
  }

  public getConsumidoDiarioAcostado(): void {
    this._api.get('pgp/consumidodiarioacostado').subscribe(res => {
      if (res.success) {
        let data: any[] = [];
        if (this.context === 'ALTA-CENTRO' || this.context === 'AGUACHICA') {
          res.data.asmet8006.map((r: any) => {
            data.push(Math.round(r.TotalEjecutado));
            this.categoriasConsumidoDiarioAcostado.push(Math.round(r.Dia));
          });
          this.dataConsumidoDiarioAcostado.push({
            name: 'PGP ASMET SALUD EPS SAS - SUBSIDIADO',
            data: data,
          });
        }
        if (this.context === 'ALTA-CENTRO' || this.context === 'AGUACHICA') {
          data = [];
          res.data.asmet8010.map((r: any) => {
            data.push(Math.round(r.TotalEjecutado));
          });
          this.dataConsumidoDiarioAcostado.push({
            name: 'CONTINGENTE PGP ASMET SALUD',
            data: data,
          });
        }
        if (this.context === 'ALTA-CENTRO' || this.context === 'VALLEDUPAR') {
          data = [];
          res.data.nuevaeps.map((r: any) => {
            data.push(Math.round(r.TotalEjecutado));
          });
          this.dataConsumidoDiarioAcostado.push({
            name: 'PGP NUEVA EPS- CONTRIBUTIVO',
            data: data,
          });
        }

        this.showConsumidoDiarioAcostado = true;
        this._cd.markForCheck();
      }
    });
  }

  public select(type: string): void {
    if (type === 'facturado') {
      this.showFacturado = true;
      this.showAcostado = false;
      this.graficasTitle = 'Facturado';
    } else {
      this.showFacturado = false;
      this.showAcostado = true;
      this.graficasTitle = 'Acostado';
    }
  }

  public generateTechoRegServDia(consumidoFacturado: any): void {
    let daysInMont = parseInt(this._timer.daysInMonth(this.inicioReporte));
    let daysSelected = this._timer.diffInDays(this.inicioReporte, this.finalReporte) + 1;
    let techoDiarioNuevaEps: any[] = [];
    let techoDiarioAsmet: any[] = [];
    let contratadoAsmet = 0;
    consumidoFacturado.map((r: any) => {
      if (this.context === 'ALTA-CENTRO' || this.context === 'VALLEDUPAR') {
        if (
          r.NContrato.includes(contratosE._8001) ||
          r.NContrato.includes(contratosE._I202)
        ) {
          let result = Math.round(r.contratado / daysInMont);
          for (let i = 1; i <= daysSelected; i++) {
            techoDiarioNuevaEps.push(result);
          }
        }
        if (r.NContrato.includes(contratosE._ASMET)) {
          contratadoAsmet += Math.round(r.contratado / daysInMont);
        }
      } else {
        if (r.NContrato.includes(contratosE._8003_8004)) {
          let result = Math.round(r.contratado / daysInMont);
          for (let i = 1; i <= daysInMont; i++) {
            techoDiarioAsmet.push(result);
          }
        }
      }
    });

    if (this.context === 'ALTA-CENTRO') {
      this.dataConsumidoDiario.push({
        name: 'Promedio Facturación Nueva EPS',
        data: techoDiarioNuevaEps,
      });
      for (let i = 1; i <= daysSelected; i++) {
        techoDiarioAsmet.push(contratadoAsmet);
      }
      this.dataConsumidoDiario.push({
        name: 'Promedio Facturación ASMET',
        data: techoDiarioAsmet,
      });
    } else if (this.context === 'VALLEDUPAR') {
      this.dataConsumidoDiario.push({
        name: 'Promedio Facturación Nueva EPS',
        data: techoDiarioNuevaEps,
      });
    } else {
      this.dataConsumidoDiario.push({
        name: 'Promedio Facturación ASMET',
        data: techoDiarioAsmet,
      });
    }
    this.showConsDiaG3 = true;
    this._cd.markForCheck();
  }

  public getAgrupadoresNuevaEps(contrato: string): void {
    const url = `pgp/agrupadores?contrato1=${contrato}&contrato2=${contrato}&fechaInicio=${this.inicioReporte}&fechaFin=${this.finalReporte}&centro1=${this._id1}&centro2=${this._id2}`;
    this._api.get(url).subscribe(res => {
      if (res.success) {
        res.data.map((r: any) => {
          this.dataAgrupadoresNuevaEPS.push({
            name: r.Agrupador,
            y: r.TotalEjecutado,
          });
        });
        this.showAgrupadoresNuevaEps = true;
        this._cd.markForCheck();
      }
    });
  }

  public getAgrupadoresASMET(): void {
    const url = `pgp/agrupadores?contrato1=${8005}&contrato2=${8006}&fechaInicio=${
      this.inicioReporte
    }&fechaFin=${this.finalReporte}&centro1=${this._id1}&centro2=${this._id2}`;
    this._api.get(url).subscribe(res => {
      res.data.map((r: any) => {
        this.dataAgrupadoresASMET.push({
          name: r.Agrupador,
          y: r.TotalEjecutado,
        });
      });
      this.showAgrupadoresASMET = true;
      this._cd.markForCheck();
    });
  }
}
