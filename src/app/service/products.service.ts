import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private BesUrl = environment.apiEndpointBase;
  constructor(private _http: HttpClient) {}

  getMethod(url_paremter: any) {
    return this._http.get(this.BesUrl + url_paremter);
  };

  getGstin(url_paremter: any) {
    return this._http.get('https://sheet.gstincheck.co.in/check/' + url_paremter);
  };

  deleteRfq(req: any) {
    return this._http.get(this.BesUrl + '/delete_quote_by_id', req);
  };

  viewAllProduct(reqParameter: any) {
    return this._http.post(this.BesUrl + '/filter-product-menu', reqParameter);
  };

  storeRfq(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/store_quotes', reqParameter);
  };

  updateRfq(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/update_quotes', reqParameter);
  };
  getAllNews() {
    return this._http.get(this.BesUrl + '/get_all_news_all');
  }

  getAllProducts() {
    return this._http.get(this.BesUrl + '/filter-product-menu');
  };

  getAllRequestOfRfq() {
    return this._http.get(this.BesUrl + '/user/quotes_list');
  };

  filterProducts(requestData: any) {
    return this._http.post(this.BesUrl + '/filter-product-menu', requestData);
  };

  deleteKamRfq(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/delete_quote_sche', reqParameter);
  };

  // user/submit_requote_id

  reqouteData(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/submit_requote_id', reqParameter);
  };

  rfqStatusData(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/update_quotes_sche', reqParameter);
  };

  priceCalculation(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/get-store-pro-price', reqParameter);
  };

  getPiceValue() {
    return this._http.get(this.BesUrl + '/user/get-threshold-price');
  };
}