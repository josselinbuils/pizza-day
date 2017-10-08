import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Observable';

import { Log } from './log.service';

// const ERROR_TIMEOUT = 'Unable to contact server';
const ERROR_UNKNOWN = 'An error occurred';

// const REQUEST_TIMEOUT = 10000;

@Injectable()
export class DataService {

  private static _getError(res: any): string {
    Log.debug('DataService->_getError()');

    let error: any;

    try {
      error = res.json().error;
    } catch (e) {
      // Empty
    }

    return error || res.message || ERROR_UNKNOWN;
  }

  constructor(private _http: HttpClient, private _router: Router) {
  }

  del(url: string, checkAuthorization?: boolean): Observable<any> {
    return this._request('DELETE', url, checkAuthorization);
  }

  get(url: string, checkAuthorization?: boolean): Observable<any> {
    return this._request('GET', url, checkAuthorization);
  }

  patch(url: string, checkAuthorization: boolean, data: any): Observable<any> {
    return this._request('PATCH', url, checkAuthorization, data);
  }

  post(url: string, checkAuthorization: boolean, data: any): Observable<any> {
    return this._request('POST', url, checkAuthorization, data);
  }

  private _request(method: string, url: string, checkAuthorization: boolean = true, data?: any): Observable<any> {
    Log.debug('DataService->_request()');

    return Observable.create((observer: any) => {

      const options: RequestOptions = <RequestOptions> {};

      if (['POST', 'PATCH'].indexOf(method) !== -1) {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        options.body = JSON.stringify(data);
        options.headers = headers;
      }

      this._http.request(method, url, <any> options)
      // TODO update this
      // .timeout(REQUEST_TIMEOUT, new Error(ERROR_TIMEOUT))
        .subscribe((res: any) => {
          Log.debug('DataService->_request: success');

          try {
            observer.next(res.json());
          } catch (e) {
            observer.next(res.text());
          }

          observer.complete();

        }, res => {

          if (checkAuthorization && res.status === 401) {
            Log.debug('DataService->_request: user not logged, display login component');
            this._router.navigate(['Login']);
          }

          const error = DataService._getError(res);

          Log.debug('DataService->_request: error: ' + error.toLowerCase());
          observer.error(error);
        });
    });
  }
}

interface RequestOptions {
  body?: string;
  headers?: Headers;
}
