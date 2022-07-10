import { Injectable } from '@angular/core';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as dayjs from 'dayjs';
import(`dayjs/locale/es`);
dayjs.extend(relativeTime);

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private _locale = 'es';
  /**
   * Returns the received value converted into a dayjs.Dayjs element
   * with their respective properties.
   */
  public getDate(date: any = new Date()): any {
    const result = dayjs(date).locale(this._locale);
    return result;
  }
  /**
   * 1 - 'YYYY-MM-DD' (2022-02-25).
   *
   * 2 - 'DD-MMM-YYYY' (01-FEB-2022).
   *
   * 3 - 'D/MMM/YYYY, h:mm:ss a' (15/feb./2022, 3:30:25 pm).
   *
   * 4 - 'D/MMM/YYYY' (15/feb./2022).
   *
   * 5 - 'D/MM/YYYY' (15/02/2022).
   *
   * 6 - 'DD [de] MMMM [de] YYYY' (15 de febrero de 2022).
   * @param date (actual date by default)
   * @param format (format received)
   * @param upperCase (convert to uppercase, true by default)
   * @returns date formmated
   */
  public formatDate(
    date: any = new Date(),
    format: number = 1,
    upperCase: boolean = true,
  ): string {
    let formatOnString = 'YYYY-MM-DD';
    if (format === 2) formatOnString = 'DD-MMM-YYYY';
    if (format === 3) formatOnString = 'D/MMM/YYYY, h:mm:ss a';
    if (format === 4) formatOnString = 'D/MMM/YYYY';
    if (format === 5) formatOnString = 'D/MM/YYYY';
    if (format === 6) formatOnString = 'DD [de] MMMM [de] YYYY';
    const result = dayjs(date).locale(this._locale).format(formatOnString);
    if (upperCase) {
      return result.toUpperCase();
    } else {
      return result.toLowerCase();
    }
  }
  /** Remove time and timezone from date. */
  splitFromT(date: any): string {
    return date.toISOString().split('T')[0];
  }
  /** Returns the last day of the current month in YYYY-MM-DD format (2022-01-31). */
  public lastDayOfActualMonth(): any {
    return dayjs(
      this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
    ).locale(this._locale);
  }
  /** Validates if the date belongs to the current month. */
  belongsToCurrentMonth(date: string): boolean {
    const actualMonth = dayjs().locale(this._locale).format('MM-YYYY');
    const selectedMonth = dayjs(date).locale(this._locale).format('MM-YYYY');
    if (actualMonth === selectedMonth) {
      return true;
    } else {
      return false;
    }
  }
  /** Validates if the date belongs to the last month. */
  belongsToLastMonth(date: string): boolean {
    const lastMonth = dayjs().locale(this._locale).subtract(1, 'month').format('MM-YYYY');
    const selectedMonth = dayjs(date).locale(this._locale).format('MM-YYYY');
    if (lastMonth === selectedMonth) {
      return true;
    } else {
      return false;
    }
  }
  /** Return the amount of days in the date's month. */
  daysInMonth(date: any = new Date()): string {
    return dayjs(date).locale(this._locale).daysInMonth().toString();
  }
  /** Return the diff in days between two dates. */
  diffInDays(start: any, end: any): number {
    return dayjs(end).diff(dayjs(start)) / (1000 * 60 * 60 * 24);
  }
  /** Validates if the date is older than today. */
  OlderThanToday(date: string): boolean {
    const today = dayjs(new Date()).locale(this._locale).format('YYYY-MM-DD');
    const dateToCompare = dayjs(date).locale(this._locale).format('YYYY-MM-DD');
    if (dateToCompare >= today) {
      return true;
    } else {
      return false;
    }
  }
  /** Return actual date with hours and minutes for rename a file. */
  dateForFiles(): string {
    return dayjs(new Date()).locale(this._locale).format('DDMhmmss');
  }
  /** Return current month.  */
  currentMonth(): string {
    return dayjs(new Date()).locale(this._locale).format('MM');
  }
  /** Return current year.  */
  currentYear(): string {
    return dayjs(new Date()).locale(this._locale).format('YYYY');
  }
}
