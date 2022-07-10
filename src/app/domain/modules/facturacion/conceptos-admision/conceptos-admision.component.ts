import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConceptosAdmisionDialog } from './dialog/dialog.component';
import { CAConceptoFacturacion, CAIngreso } from '../facturacion.forms';
import { SuggestionI } from 'src/app/application/interfaces/suggestion.interface';
import { ModalService } from 'src/app/application/services/modal.service';
import { StoreService } from 'src/app/application/services/store.service';
import { ToastService } from 'src/app/application/services/toast.service';
import { ApiService } from 'src/app/application/services/api.service';

@Component({
  selector: 'app-conceptos-admision',
  templateUrl: './conceptos-admision.component.html',
  styleUrls: ['./conceptos-admision.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConceptosAdmision {
  public displayedColumns: any = ['select', 'OID', 'IPRDESCOR', 'GCFNOMBRE', 'SERCANTID'];
  public columnNames: any = ['select', 'Número', 'Nombre', 'Concepto', 'Cant.'];
  public numIngreso: any = '';
  public productos: number = 0;
  public productosFiltrados: number = 0;
  public productosSeleccionados: number = 0;
  public selection: any = [];
  public roles = new FormControl([]);
  public listaRoles: any = [
    { value: 12, option: 'MEDICAMENTO POS' },
    { value: 13, option: 'MEDICAMENTO NO POS' },
  ];
  public onConsult: boolean = false;
  public loading: boolean = false;
  public myForm = new FormGroup({
    ingreso: CAIngreso,
    conceptoFacturacion: CAConceptoFacturacion,
  });
  get ingreso(): FormControl {
    return this.myForm.controls.ingreso as FormControl;
  }
  get conceptoFacturacion(): FormControl {
    return this.myForm.controls.conceptoFacturacion as FormControl;
  }
  public conceptosSuggestions: SuggestionI[] = [
    { value: 12, option: 'MEDICAMENTO POS' },
    { value: 13, option: 'MEDICAMENTO NO POS' },
    { value: false, option: 'TODOS' },
  ];
  public conceptoSuggestions: SuggestionI[] = [
    { value: 12, option: 'MEDICAMENTO POS' },
    { value: 13, option: 'MEDICAMENTO NO POS' },
  ];

  constructor(
    private _cd: ChangeDetectorRef,
    private _modal: ModalService,
    private _toast: ToastService,
    private _store: StoreService,
    private _dialog: MatDialog,
    private _api: ApiService
  ) {}

  public onSubmit(): void {
    this.loading = true;
    const ingreso = this.ingreso.value;
    const conceptFact = this.conceptoFacturacion.value
      ? this.conceptoFacturacion.value
      : null;
    const url = `concepto-admision/${ingreso}/${conceptFact}`;
    const badSuccessMsg =
      'No se encontraron resultados con los filtros establecidos en formulario';
    this._api.get(url).subscribe(res => {
      if (res.success) {
        this.numIngreso = ingreso;
        this._store.setDataSource(res.data);
        this.selection = [];
        this.productos = res.data.length;
        this.productosFiltrados = res.data.length;
        this.productosSeleccionados = 0;
        this.onConsult = true;
        this.loading = false;
      } else {
        this._toast.notification(badSuccessMsg);
        if (this.onConsult) {
          this.backToForm();
        }
        this.loading = false;
      }
      this._cd.markForCheck();
    });
  }

  public setRoles(): void {
    if (this.selection.length <= 0) {
      this._modal.alert('Usted no ha seleccionado ningún producto');
    } else {
      let select: any = [];
      this.selection.map((r: any) => {
        select.push(r.OID);
      });
      const dialog = this._dialog.open(ConceptosAdmisionDialog, {
        maxHeight: '400px',
        maxWidth: '400px',
        data: select,
      });
      dialog.afterClosed().subscribe(data => {
        if (data !== undefined) {
          if (data === true) {
            this.selection = [];
            this._store.setDataSource([]);
            this.loading = true;
            setTimeout(() => {
              this.onSubmit();
            }, 1000);
          } else {
            this._toast.notification(data);
          }
        }
      });
    }
  }

  public onSelectRows(rows: any): void {
    this.selection = rows;
    this.productosSeleccionados = rows.length;
  }

  public onFiltering(rows: any): void {
    this.selection = [];
    this.productosFiltrados = rows.length;
    this.productosSeleccionados = 0;
  }

  public onResetFilter(): void {
    this.selection = [];
    this.productosFiltrados = this.productos;
    this.productosSeleccionados = 0;
  }

  public backToForm(): void {
    this.onConsult = false;
    this.productos = 0;
    this.productosFiltrados = 0;
    this.productosSeleccionados = 0;
    this.selection = [];
  }
}
