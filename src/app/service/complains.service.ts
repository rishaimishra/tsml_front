import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplainsService {

  private BesUrl = environment.apiEndpointBase;
  constructor(private _http: HttpClient) { }

  private subject = new BehaviorSubject<string>('');

  getMethod(url_paremter: any) {
    return this._http.get(this.BesUrl + url_paremter);
  };

  getCategories() {
    return this._http.get(this.BesUrl + '/user/complain-category-list');
  };

  storeComplain(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/store-complain-main', reqParameter);
  };

  getComplainsKamList(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/get-complain-list-kam', reqParameter);
  };

  replyComplains(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/remarks-replay', reqParameter);
  };

  saveProduction(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/monthly_prod_plan_submit', reqParameter);
  };

  storeDailyProd(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/prod-qty-upload', reqParameter);
  };

  storeDispatchPlan(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/submit_dispatch_plan', reqParameter);
  };

  OrderPlaning(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/get_order_planning', reqParameter);
  };

  orderPlaningUpload(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/monthly_prod_plan_submit', reqParameter);
  };
  getDepartment() {
    return this._http.get(this.BesUrl + '/user/get-deparment');
  };

  getDeprtEmail(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/get-deparment-mail', reqParameter);
  };
  sendEmail(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/send-com-mail', reqParameter);
  };
  emailReceve(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/com-mail-confirm', reqParameter);
  };
  openModelSubmit(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/get-com-manage-data', reqParameter);
  };
  storeComplainFiles(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/store-com-files', reqParameter);
  };

  sendData(data:string) {
    this.subject.next(data)
  };

  receiveData(): Observable<string> {
    return this.subject.asObservable();
  };
}
