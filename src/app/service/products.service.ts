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

  viewAllProduct(reqParameter: any) {
    return this._http.post(this.BesUrl + '/filter-product-menu', reqParameter);
  };

  getAllNews() {
    return this._http.get(this.BesUrl + '/get_all_news_all');
  }

  getAllProducts() {
    return this._http.get(this.BesUrl + '/filter-product-menu');
  };

  filterProducts(requestData: any) {
    return this._http.post(this.BesUrl + '/filter-product-menu', requestData);
  };

}