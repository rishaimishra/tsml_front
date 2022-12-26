import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private BesUrl = environment.apiEndpointBase;

  constructor(private _http: HttpClient) { }
  
  getMethod(url_paremter: any) {
    return this._http.get(this.BesUrl + url_paremter);
  };

  getSapContractType() {
    return this._http.get(this.BesUrl + '/user/get_sap_contract_type');
  };

  getSalesPO() {
    return this._http.get(this.BesUrl + '/user/get_all_sc_po');
  };

  getSalesOrg() {
    return this._http.get(this.BesUrl + '/user/get-sap-sales-org');
  };

  getSalesSapGroup() {
    return this._http.get(this.BesUrl + '/user/get_sap_sales_group');
  };

  getSalesDistri() {
    return this._http.get(this.BesUrl + '/user/get-distri-channel');
  };

  getSapDivi(reqData) {
    return this._http.post(this.BesUrl + '/user/get-sap-division', reqData);
  };

  getSaleOffice() {
    return this._http.get(this.BesUrl + '/user/get-sales-office');
  };

  getDlvryMode() {
    return this._http.get(this.BesUrl + '/user/get_sap_delivery_mode');
  };
  getSapFreight() {
    return this._http.get(this.BesUrl + '/user/get_sap_freight');
  };

  getFreightIndicat() {
    return this._http.get(this.BesUrl + '/user/get_sap_freight_indi');
  };

  getCustGroup() {
    return this._http.get(this.BesUrl + '/user/get_sap_customer_group');
  };
  
  getIncoterms() {
    return this._http.get(this.BesUrl + '/user/get_sap_incoterms');
  };

  paymentTerms() {
    return this._http.get(this.BesUrl + '/user/get-sap-payment-terms');
  };

  submitSalesCnt(request:any) {
    return this._http.post(this.BesUrl + '/user/sales_cnt_submit', request);
  };

  getOrderType() {
    return this._http.get(this.BesUrl + '/user/get-order-type');
  };

  submitSalesSo(request:any) {
    return this._http.post(this.BesUrl + '/user/so_submit', request);
  };

  submitManagerRfq(request:any) {
    return this._http.post(this.BesUrl + '/user/get_price_break', request);
  };

  checkQtyDo(request:any) {
    return this._http.post(this.BesUrl + '/user/validate_do_qty', request);
  };

}
