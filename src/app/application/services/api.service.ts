import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseI } from '../interfaces/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _url: string = environment.API_URL;

  constructor(private _http: HttpClient) {}

  public post(form: any, route: string): Observable<ResponseI> {
    let headers = this.generateHeaders();
    return this._http.post<ResponseI>(`${this._url + route}`, form, { headers });
  }

  public put(form: any, route: string, id?: number): Observable<ResponseI> {
    let headers = this.generateHeaders();
    const url = id !== undefined ? `${this._url + route}/${id}` : `${this._url + route}`;
    return this._http.put<ResponseI>(url, form, { headers });
  }

  public get(route: string): Observable<ResponseI> {
    let headers = this.generateHeaders();
    return this._http.get<ResponseI>(`${this._url + route}`, { headers });
  }

  public delete(route: string): Observable<ResponseI> {
    let headers = this.generateHeaders();
    return this._http.delete<ResponseI>(`${this._url + route}`, { headers });
  }

  private generateHeaders() {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('AuthToken')}`,
      Accept: 'application/json',
    });
    return headers;
  }
}
