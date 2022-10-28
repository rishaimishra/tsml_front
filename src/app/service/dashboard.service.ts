import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private BesUrl = environment.apiEndpointBase;


  constructor(private _http: HttpClient) { }

  getMethod(url_paremter: any) {
    return this._http.get(this.BesUrl + url_paremter);
  };

  getKamList() {
    return this._http.get(this.BesUrl + '/user/kam_quotes_list');
  };
}
