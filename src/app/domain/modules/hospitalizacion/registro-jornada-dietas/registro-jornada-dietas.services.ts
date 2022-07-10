import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RegistroJornadaDietasService {

    constructor() { }

    /**
     * Filtra elementos del array por el NAME y retorna un array nuevo con
     * solo dos elementos del anterior, el HSUCODIGO y el NAME
     * @param field 
     * @param array 
     * @returns newArray
     */
    filtrarSubgrupos(field: any, array: any): any {
        let newArray: any = [];
        if (field !== '') {

            if (array.filter((element: { NAME: string; }) =>
                element.NAME.includes(field.toUpperCase())).length) {

                if (!newArray.length && newArray.filter((element: { NAME: string; }) =>
                    element.NAME.includes(field.toUpperCase())).length === 0) {
                    array.filter((element: { NAME: string; }) =>
                        element.NAME.includes(field.toUpperCase()))
                        .map((r: { HSUCODIGO: any; NAME: any }) =>
                            newArray.push({ HSUCODIGO: r.HSUCODIGO, NAME: r.NAME }))
                }
            } else {
                newArray.push({ HSUCODIGO: null, NAME: 'No se encontraron resultados' });
            }
        }
        return newArray;
    }

    getPacientesToSend(array: any): any {
        let newArray: any = [];
        newArray = array.filter((el: { HCSDIENOM: string | string[]; }) => el.HCSDIENOM !== null);
        newArray = newArray.filter((el: { DIEGRUTIP: string; }) => !el.DIEGRUTIP.includes('NADA VIA ORAL'))
            .filter((el: { DIEGRUTIP: string; }) => !el.DIEGRUTIP.includes('NO APLICA'))
            .filter((el: { DIEGRUCON: string; }) => el.DIEGRUCON !== 'NADA VIA ORAL')
            .filter((el: { HCSFECFOL: any; HPNESTANC: any; }) => el.HCSFECFOL || el.HPNESTANC);
        return newArray;
    }
}