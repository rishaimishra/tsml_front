import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private BesUrl = environment.apiEndpointBase;


  constructor(private _http: HttpClient) { }

  getMethod(url_paremter: any):Observable<any> {
    return this._http.get(this.BesUrl + url_paremter);
  };

  getKamList():Observable<any> {
    return this._http.get(this.BesUrl + '/user/kam_quotes_list');
  };

  dashboardItem(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/user-dashboard', request);
  };
}
