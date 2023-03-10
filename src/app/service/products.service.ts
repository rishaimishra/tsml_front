import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  headers= new HttpHeaders().set('content-type', 'application/json');

  private BesUrl = environment.apiEndpointBase;
  constructor(private _http: HttpClient) {}
  getMethod(url_paremter: any):Observable<any> {
    return this._http.get(this.BesUrl + url_paremter);
  };

  postMethopd(url:any,params: any):Observable<any> {
    return this._http.post(this.BesUrl+url, params);
  };
  
  deleteRfq(req: any):Observable<any> {
    return this._http.get(this.BesUrl + '/delete_quote_by_id', req);
  };

  viewAllProduct(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/filter-product-menu', reqParameter);
  };

  storeRfq(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/store_quotes', reqParameter,{ 'headers': this.headers });
  };

  updateRfq(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/update_quotes', reqParameter,{ 'headers': this.headers });
  };
  getAllNews():Observable<any> {
    return this._http.get(this.BesUrl + '/get_all_news_all');
  }

  getAllProducts():Observable<any> {
    return this._http.get(this.BesUrl + '/filter-product-menu');
  };

  getAllRequestOfRfq():Observable<any> {
    return this._http.get(this.BesUrl + '/user/quotes_list');
  };

  getAllRfqForKam():Observable<any> {
    return this._http.get(this.BesUrl + '/user/kam_quotes_list');
  };

  filterProducts(requestData: any):Observable<any> {
    return this._http.post(this.BesUrl + '/filter-product-menu', requestData);
  };

  getSubcat(requestData: any):Observable<any> {
    return this._http.post(this.BesUrl + '/subcategory-product-menu', requestData);
  };

  deleteKamRfq(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/delete_quote_sche', reqParameter);
  };


  reqouteData(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/submit_requote_id', reqParameter);
  };

  rfqStatusData(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/update_quotes_sche', reqParameter);
  };

  priceCalculation(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/get-store-pro-price', reqParameter,{ 'headers': this.headers });
  };

  getPiceValue():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get-threshold-price');
  };
  getPoItems():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_quote_po_by_id');
  };

  uploadLetterHeadFile(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/submit_po', reqParameter);
  };
  
  getPoList():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_po_all');
  };

  getkamPoList():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_po_all_kam');
  };

  rfqStatusChange(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/quotes_status_update', reqParameter);
  };

  remarksDelet(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/delete_quote_by_id', reqParameter);
  };

  acceptOrRejectPO(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/po_status_update', reqParameter);
  };
  amendPO(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/update_po', reqParameter);
  };

  updateTantetive(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/sales_update_rfq', reqParameter);
  };

  qouteStatusUpdate(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/quotes_status_update', reqParameter);
  };

  dlvrySchdule(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/create_rfq_deliveries', reqParameter);
  };

  getDeliveryMethod():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_all_deliveries');
  };

  poAttachmentUpl(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/update_letterhead', reqParameter);
  };

  rfqSubmitedEmail(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/quote_gen_mail', reqParameter);
  };

  salesSubmitedEmail(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/sale_accpt_mail', reqParameter);
  };

  reqouteCount(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/update_count_requote', reqParameter);
  };

  orderConfirmEmail(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/order_cnrfm_mail', reqParameter);
  };
  
  confirmRfqEmail(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/accepted_price_mail', reqParameter);
  };
  camNotification(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/cam_notification_submit', reqParameter);
  };
  removeNotiCam(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/up_cam_noti', reqParameter);
  };
  salesNoti(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/sales_notification_submit', reqParameter);
  };
  getSalesNoti():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_sales_notification');
  };
  salesRemoveNoti(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/up_sales_noti', reqParameter);
  };
  custNotiSubmit(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/cus_notification_submit', reqParameter);
  };

  plantNotiSubmit(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/plant_notification_submit', reqParameter);
  };

  custNotiRemove(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/up_cus_noti', reqParameter);
  };
  saveComPrice(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/price_break_save', reqParameter);
  };
  getIdbyPlant(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/get_plant_id', reqParameter);
  };

  getPriceComp():Observable<any> {
    return this._http.get(this.BesUrl + '/user/get_price_comp');
  };

  getRfqStatusKam(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/get-rfq-order-status-kam', reqParameter);
  };
  storeStatusKam(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/store-order-status-kam', reqParameter);
  };

  getRfqStatusCust(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/get-rfq-order-status-cust', reqParameter);
  };
  storeStatusCust(reqParameter: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/store-rfq-order-status-cust', reqParameter);
  };

  getMjGstIn(url_paremter: any):Observable<any> {
    return this._http.get('https://demo-tsml.mjunction.in/tsml-api/api/gst_details_dummy/' + url_paremter);
  };
  searchRfq(url_paremter: any):Observable<any> {
    return this._http.post(this.BesUrl +'/user/rfq_search_list', url_paremter);
  };
  searchPo(url_paremter: any):Observable<any> {
    return this._http.post(this.BesUrl +'/user/po_search_list', url_paremter);
  };

  submitFinalQouteMail(url_paremter: any):Observable<any> {
    return this._http.post(this.BesUrl +'/sale_head_accpt_mail', url_paremter);
  };

  submitRfqRemarks(url_paremter: any):Observable<any> {
    return this._http.post(this.BesUrl +'/user/submit_remarks', url_paremter);
  };

  remarksList(url_paremter: any):Observable<any> {
    return this._http.post(this.BesUrl +'/user/view_remarks', url_paremter);
  };
}