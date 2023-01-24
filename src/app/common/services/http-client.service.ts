import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(private _http: HttpClient) {}

  createAuthorizationHeader(headers: HttpHeaders, token: string): HttpHeaders {
    return headers.set('Authorization', `Bearer ${token}`);
  }

  get(url: string, token: string): Observable<Object> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers, token);
    return this._http.get(url, {
      headers: headers,
    });
  }

  post(url: string, data: any | null, token: string): Observable<Object> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers, token);
    return this._http.post(url, data, { headers });
  }

  delete(url: string, token: string): Observable<Object> {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers, token);
    return this._http.delete(url, {
      headers: headers,
    });
  }
}
