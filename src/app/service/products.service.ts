import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  BesUrl = environment.apiEndpointBase;
  constructor(private http: HttpClient) {}

  getMethod(url_paremter: any) {
    return this.http.get(this.BesUrl + url_paremter);
  }
}