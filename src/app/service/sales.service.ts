import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  headers= new HttpHeaders().set('content-type', 'application/json');
  private BesUrl = environment.apiEndpointBase;

  constructor(private _http: HttpClient) { }
  
  getMethod(url_paremter: any) {
    return this._http.get(this.BesUrl + url_paremter);
  };

  getSapContractType():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sap_contract_type');
  };

  getSalesPO():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_all_sc_po');
  };

  getSalesOrg():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get-sap-sales-org');
  };

  getSalesSapGroup():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sap_sales_group');
  };

  getSalesDistri():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get-distri-channel');
  };

  getSapDivi(reqData:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/get-sap-division', reqData);
  };

  getSaleOffice():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get-sales-office');
  };

  getDlvryMode():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sap_delivery_mode');
  };
  getSapFreight():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sap_freight');
  };

  getFreightIndicat():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sap_freight_indi');
  };

  getFreightPartn():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get-freight-partner');
  };

  getCustGroup():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sap_customer_group');
  };
  
  getIncoterms():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sap_incoterms');
  };

  paymentTerms():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get-sap-payment-terms');
  };

  submitSalesCnt(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/sales_cnt_submit', request);
  };

  getOrderType():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get-order-type');
  };

  getPlantNoti(request:any):Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_plant_notification/'+ request);
  };

  submitSalesSo(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/so_submit', request);
  };

  submitManagerRfq(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/get_price_break', request, { 'headers': this.headers });
  };

  checkQtyDo(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/validate_do_qty', request);
  };

  poStatus(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/po_status_update', request);
  };

  sapReq(request:any):Observable<any> {
    return this._http.post('https://15.207.150.126:50001/RESTAdapter/SalesContract', request);
  };

  sapSoReq(request:any):Observable<any> {
    return this._http.post(this.BesUrl +'/sap_sales_order', request);
  };

  salesContract(request:any):Observable<any> {
    return this._http.post(this.BesUrl +'/sap_sales_contarct', request);
  };
  
  rejectRemarks(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/sm_remark_save', request);
  };

  uploadFgStock(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/prod-qty-upload-user', request);
  };

  sendScMail(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/sc_mail', request);
  };

  scInExcelSave(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/sc_excel_submit', request,{ 'headers': this.headers });
  };

  excelEmail(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/sc_excel_mail', request);
  };

  excelEmail2(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/plant_doexcel_mail', request);
  };

  getAddrCode(request:any):Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_addr_code/'+ request);
  };

  updateSc(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/up_excelsc', request,{ 'headers': this.headers });
  };

  getScInfoList():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_all_excelsc');
  };


  getHeadNoti():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sh_notification');
  };

  clearHedNoti():Observable<any> {
    return this._http.get(this.BesUrl + '/user/up_sh_notification_all');
  };
  clearPlantNoti():Observable<any> {
    return this._http.get(this.BesUrl + '/user/clearall_plant_noti');
  };

  salesHeadNoti(data:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/sh_notification_submit', data);
  };

  plantMail(data:any):Observable<any> {
    return this._http.post(this.BesUrl + '/pant_do_mail', data);
  };

  plantNotification(data:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/plant_notification_submit', data);
  };

  updateContractNo(data:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/update_contarcts_no', data);
  };

  veiwDOcustom(data:any):Observable<any> {
    return this._http.post(this.BesUrl + '/do-summary', data);
  };

  custDoMail(data:any):Observable<any> {
    return this._http.post(this.BesUrl + '/cus_do_mail', data);
  };

  getMaterial():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_all_mats');
  };
  getProcPay():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get-pay-gurantee-pos');
  };
  getCity():Observable<any> {
    return this._http.get(this.BesUrl + '/get_all_city');
  };
  getPlant():Observable<any> {
    return this._http.get(this.BesUrl + '/get_all_plants');
  };

}
