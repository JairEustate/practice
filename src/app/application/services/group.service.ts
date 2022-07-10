import { Injectable } from "@angular/core";
import { GroupI } from "../interfaces/group.interface";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  constructor() {}

  /**
   * Retorna la información recibida agrupada por un elemento clave, generalmente
   * un ID numerico.
   * @param data
   * @param idKeyData
   * @param nameKeyData
   * @returns groupRowsById
   */
  groupByCommonId(data: Object, idKeyData: string, nameKeyData?: string): GroupI[] {
    const groupById = this.groupById(data, idKeyData, nameKeyData);
    const groupRowsById = this.groupRowsById(data, groupById, idKeyData);
    return groupRowsById;
  }
  private groupById(data: any, idKey: string, nameKey: string = "NAME") {
    const newArr: any = [];
    data.map((r: any) => {
      let count: boolean = false;
      if (newArr.length === 0) {
        newArr.push({ ID: r[idKey], NAME: r[nameKey], ROWS: [] });
      } else {
        newArr.map((i: any) => {
          if (i.ID === r[idKey]) {
            count = true;
          }
        });
        if (!count) {
          newArr.push({ ID: r[idKey], NAME: r[nameKey], ROWS: [] });
        }
      }
    });
    return newArr;
  }
  private groupRowsById(data: any, groupers: any, idKeyData: string) {
    groupers.map((r: any) => {
      data.map((i: any) => {
        if (i[idKeyData] === r["ID"]) {
          r.ROWS.push(i);
        }
      });
    });
    return groupers;
  }
}
