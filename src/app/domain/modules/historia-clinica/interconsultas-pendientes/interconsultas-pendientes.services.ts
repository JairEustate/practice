import { Injectable } from '@angular/core';
import { InterconsultaI } from './interconsultas-pendientes.interfaces';
import { StadisticI } from 'src/app/application/interfaces/stadistic.interface';
import { TimerService } from 'src/app/application/services/timer.service';

@Injectable({
  providedIn: 'root',
})
export class InterconsultasPendientesService {
  constructor(private _timer: TimerService) {}

  /**
   * Genera estadisticas con la primera parte de la información
   * que será renderizada.
   * @param paciente
   * @returns estadisticasI[]
   */
  getInfoPaciente_1(paciente: InterconsultaI): StadisticI[] {
    const result: StadisticI[] = [
      { key: 1, value: 'Ingreso:', result: paciente.AINCONSEC },
      { key: 2, value: 'Consecutivo:', result: paciente.HCNINTERC },
      {
        key: 3,
        value: 'Solicitud:',
        result: this._timer.formatDate(paciente.HCNFECFOL, 3),
      },
      { key: 4, value: 'Cama:', result: paciente.HCACODIGO },
    ];
    return result;
  }
  /**
   * Genera estadisticas con la segunda parte de la información
   * que será renderizada.
   * @param paciente
   * @returns estadisticasI[]
   */
  getInfoPaciente_2(paciente: InterconsultaI): StadisticI[] {
    const result: StadisticI[] = [
      { key: 5, value: 'Ubicación:', result: paciente.HCANOMBRE },
      {
        key: 6,
        value: 'Diagnóstico:',
        result: `${paciente.DIACODIGO !== null ? paciente.DIACODIGO : '?????'} - ${
          paciente.DIANOMBRE !== null ? paciente.DIANOMBRE : '??????????????'
        }`,
      },
      { key: 7, value: 'Especialidad:', result: paciente.GEEDESCRI },
      { key: 8, value: 'Area de servicio solicitante:', result: paciente.HSUNOMBRE },
      { key: 9, value: 'Motivo de consulta:', result: paciente.HCIMOTIVO },
    ];
    return result;
  }
}
