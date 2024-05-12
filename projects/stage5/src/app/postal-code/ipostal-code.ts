import { Observable } from "rxjs"

export interface IPostalCode {
  countryCode: string
  postalCode: string
  placeName: string
  lng: number
  lat: number
}

export interface IPostalCodeData {
  postalCodes: [IPostalCode];
}

export interface IPostalCodeService {
  resolvePostalCode(postalCode: string): Observable<IPostalCode | null>;
}
