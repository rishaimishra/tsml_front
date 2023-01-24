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

  logOut(data: any) {
    return this._http.post(this.BesUrl + '/user/logout', data);
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

  submitForgetPass(data: any) {
    return this._http.post(this.BesUrl + '/password-update', data);
  };

  gstApi() {
    return this._http.get(this.BesUrl + '/gst_details_dummy');
  };

  getSecurityQue() {
    return this._http.get(this.BesUrl + '/get_security_questions');
  };

  clearNoti(request:any) {
    return this._http.post(this.BesUrl + '/user/clear_notification', request);
  };
  
  forgetPass(request:any) {
    return this._http.post(this.BesUrl + '/password-email',  request);
  };

  checkEmail(request:any) {
    return this._http.post(this.BesUrl + '/chk_email',  request);
  };

  forceLogOut(request:any) {
    return this._http.post(this.BesUrl + '/force_logout',  request);
  };

  setSecurityQu(request:any) {
    return this._http.post(this.BesUrl + '/save_security_qst_ans',  request);
  };

  matchSecurityQu(request:any) {
    return this._http.post(this.BesUrl + '/security_qstn_match',  request);
  };

  emailSecurityQu(request:any) {
    return this._http.post(this.BesUrl + '/security_qstn_mail',  request);
  };

  passwordReset(request:any) {
    return this._http.post(this.BesUrl + '/password-reset',  request);
  };

  getOtpMobile(request:any) {
    return this._http.post(this.BesUrl + '/user/update-mobile-number',  request);
  };

  verifyMobile(request:any) {
    return this._http.post(this.BesUrl + '/user/update-mobile-user',  request);
  };

  save_token(request:any) {
    return this._http.post(this.BesUrl + '/get_save_token',  request);
  };

}
