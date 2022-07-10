import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/domain/shared/shared.module';
import { HospitalizacionRoutingModule } from './hospitalizacion-routing.module';
import {
  CensoPacientes,
  CensoPacientesDetalles,
} from './censo-pacientes/censo-pacientes.component';
import { JornadaDietas } from './jornada-dietas/jornada-dietas.component';
import { JornadaDietasPdf } from './jornada-dietas/pdf/pdf.component';
import {
  RegistroJornadaDietas,
  RegistroJornadaDietasEditor,
} from './registro-jornada-dietas/registro-jornada-dietas.component';
import { CensoCamas } from './censo-camas/censo-camas.component';

@NgModule({
  declarations: [
    CensoCamas,
    CensoPacientes,
    CensoPacientesDetalles,
    JornadaDietas,
    JornadaDietasPdf,
    RegistroJornadaDietas,
    RegistroJornadaDietasEditor,
  ],
  imports: [CommonModule, SharedModule, HospitalizacionRoutingModule],
})
export class HospitalizacionModule {}
