import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers= new HttpHeaders().set('content-type', 'application/json');
  
  private BesUrl = environment.apiEndpointBase;
  constructor(private _http: HttpClient) { }


  register(data: any) {
    return this._http.post(this.BesUrl + '/register', data);
  };

  login(data: any) {
    return this._http.post(this.BesUrl + '/login', data, { withCredentials: true, 'headers': this.headers  });
  };

  logOut(data: any) {
    return this._http.post(this.BesUrl + '/user/logout', data);
  };

  isLoggedIn() {
    return localStorage.getItem('tokenUrl') != null;
  };

  getToken() {
    return localStorage.getItem('tokenUrl') || '';
  };

  getOtp(requestData: any) {
    return this._http.post(this.BesUrl + '/send-mobile-otp',requestData, { 'headers': this.headers });
  };

  verifyOtp(requestData: any) {
    return this._http.post(this.BesUrl + '/verify-mobile-otp',requestData, { 'headers': this.headers });
  };

  submitForgetPass(data: any) {
    return this._http.post(this.BesUrl + '/password-update', data, { 'headers': this.headers });
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
    return this._http.post(this.BesUrl + '/password-email',  request, { 'headers': this.headers });
  };

  checkEmail(request:any) {
    return this._http.post(this.BesUrl + '/chk_email',  request);
  };

  forceLogOut(request:any) {
    return this._http.post(this.BesUrl + '/force_logout',  request);
  };

  setSecurityQu(request:any) {
    return this._http.post(this.BesUrl + '/save_security_qst_ans',  request,{ 'headers': this.headers });
  };

  matchSecurityQu(request:any) {
    return this._http.post(this.BesUrl + '/security_qstn_match',  request);
  };

  emailSecurityQu(request:any) {
    return this._http.post(this.BesUrl + '/security_qstn_mail',  request);
  };

  passwordReset(request:any) {
    return this._http.post(this.BesUrl + '/password-reset',  request, { 'headers': this.headers });
  };

  getOtpMobile(request:any) {
    return this._http.post(this.BesUrl + '/user/update-mobile-number',  request, { 'headers': this.headers });
  };

  verifyMobile(request:any) {
    return this._http.post(this.BesUrl + '/user/update-mobile-user',  request, { 'headers': this.headers });
  };

  save_token(request:any) {
    return this._http.post(this.BesUrl + '/get_save_token',  request);
  };

  getOtpLog(request:any) {
    return this._http.post(this.BesUrl + '/send-login-otp',  request, { 'headers': this.headers });
  };

  checkExpireyUser(request:any) {
    return this._http.post(this.BesUrl + '/regis_date_log',  request);
  };

  resetOtp(request:any) {
    return this._http.post(this.BesUrl + '/resest_pass_mail',  request, { 'headers': this.headers });
  };

}
