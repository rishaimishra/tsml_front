import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplainsService {

  private BesUrl = environment.apiEndpointBase;
  constructor(private _http: HttpClient) { }

  getMethod(url_paremter: any) {
    return this._http.get(this.BesUrl + url_paremter);
  };

  getCategories() {
    return this._http.get(this.BesUrl + '/user/complain-category-list');
  };

  storeComplain(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/store-complain-main', reqParameter);
  };

  getComplainsList() {
    return this._http.get(this.BesUrl + '/user/get-complain-list-kam');
  };

  replyComplains(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/remarks-replay', reqParameter);
  };
  //user/monthly_prod_plan_submit
  saveProduction(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/monthly_prod_plan_submit', reqParameter);
  };
}
