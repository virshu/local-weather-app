import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultIfEmpty,Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IPostalCode, IPostalCodeData, IPostalCodeService } from './ipostal-code';

@Injectable({
  providedIn: 'root'
})
export class PostalCodeService implements IPostalCodeService {

  constructor(private httpClient: HttpClient) { }
  resolvePostalCode(postalCode: string): Observable<IPostalCode | null> {
    const uriParams = new HttpParams()
      .set('maxRows', '1')
      .set('username', environment.username)
      .set('postalcode', postalCode);

    return this.httpClient.get<IPostalCodeData>(
      `${environment.baseUrl}postalCodeSearchJSON`,
      {params: uriParams})
      .pipe(mergeMap(data => data.postalCodes), defaultIfEmpty(null));
  }
}
