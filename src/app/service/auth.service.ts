import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getOptRequest, getOtpResponse } from '../interfaces/mobile-verify';
import { catchError, Observable, throwError } from 'rxjs';
import { verifyOptRequest, verifyOtpResponse } from '../interfaces/verify-otp';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly GET_OTP_URL: String = 'send-mobile-otp';
  private readonly VERIFY_OTP_URL: String = 'verify-mobile-otp';


  private BesUrl = environment.apiEndpointBase;
  constructor(private _http: HttpClient) { }


  register(data: any) {
    return this._http.post(this.BesUrl + '/register', data);
  };
  login(data: any) {
    return this._http.post(this.BesUrl + '/login', data, { withCredentials: true });
  };

  isLoggedIn() {
    return localStorage.getItem('tokenUrl') != null;
  };

  getToken() {
    return localStorage.getItem('tokenUrl') || '';
  }
  getOtp(requestData: getOptRequest): Observable<getOtpResponse> {
    return this._http.post<getOtpResponse>(`${environment.apiEndpointBase}/${this.GET_OTP_URL}`, requestData);
  };

  verifyOtp(requestData: verifyOptRequest): Observable<verifyOtpResponse> {
    return this._http.post<verifyOtpResponse>(`${environment.apiEndpointBase}/${this.VERIFY_OTP_URL}`, requestData);
  };

  resetPassByEmail(data: any) {
    return this._http.post(this.BesUrl + '/password-update', data);
  };
  submitForgetPass(data: any) {
    return this._http.post(this.BesUrl + '/password-update', data);
  };

  gstApi() {
    return this._http.get(this.BesUrl + '/gst_details_dummy');
  };

  // gstDetails(request: any) {
  //   return this._http.post('http://172.16.2.102:6082/getGstDetails', request);
  // };
  clearNoti(request:any) {
    return this._http.post(this.BesUrl + '/user/clear_notification', request);
  };
  
  forgetPass(request:any) {
    return this._http.post(this.BesUrl + '/password-email',  request);
  };

  checkEmail(request:any) {
    return this._http.post(this.BesUrl + '/chk_email',  request);
  };
}
