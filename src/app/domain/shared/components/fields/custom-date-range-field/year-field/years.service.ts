import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class YearsService {
    private years = new BehaviorSubject<string[]>([]);
    years$ = this.years.asObservable();
    setYears(years: string[]) {
        this.years.next(years)
    }
}
