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

  getAllRfqForKam() {
    return this._http.get(this.BesUrl + '/user/kam_quotes_list');
  };

  filterProducts(requestData: any) {
    return this._http.post(this.BesUrl + '/filter-product-menu', requestData);
  };

  deleteKamRfq(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/delete_quote_sche', reqParameter);
  };


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
  getPoItems() {
    return this._http.get(this.BesUrl + '/user/get_quote_po_by_id');
  };

  uploadLetterHeadFile(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/submit_po', reqParameter);
  };
  
  getPoList() {
    return this._http.get(this.BesUrl + '/user/get_po_all');
  };

  getkamPoList() {
    return this._http.get(this.BesUrl + '/user/get_po_all_kam');
  };

  rfqStatusChange(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/quotes_status_update', reqParameter);
  };

  remarksDelet(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/delete_quote_by_id', reqParameter);
  };

  acceptOrRejectPO(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/po_status_update', reqParameter);
  };
  amendPO(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/update_po', reqParameter);
  };

  updateTantetive(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/sales_update_rfq', reqParameter);
  };

  qouteStatusUpdate(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/quotes_status_update ', reqParameter);
  };

  dlvrySchdule(reqParameter: any) {
    return this._http.post(this.BesUrl + '/user/create_rfq_deliveries', reqParameter);
  };
  //user/get_all_deliveries
  getDeliveryMethod() {
    return this._http.get(this.BesUrl + '/user/get_all_deliveries');
  };
}