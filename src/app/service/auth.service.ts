import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers= new HttpHeaders().set('content-type', 'application/json');
  
  private BesUrl = environment.apiEndpointBase;
  constructor(private _http: HttpClient) { }


  register(data: any):Observable<any> {
    return this._http.post('https://beas.in/tsml-microservice/register/api/register', data);
  };

  login(data: any):Observable<any> {
    return this._http.post(this.BesUrl + '/login', data, { withCredentials: true, 'headers': this.headers  });
  };

  logOut(data: any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/logout', data);
  };

  isLoggedIn() {
    return localStorage.getItem('tokenUrl') != null;
  };

  getToken() {
    return localStorage.getItem('tokenUrl') || '';
  };

  getOtp(requestData: any):Observable<any> {
    return this._http.post('https://beas.in/tsml-microservice/register/api/send-mobile-otp',requestData, { 'headers': this.headers });
  };

  verifyOtp(requestData: any):Observable<any> {
    return this._http.post('https://beas.in/tsml-microservice/register/api/verify-mobile-otp',requestData, { 'headers': this.headers });
  };

  submitForgetPass(data: any):Observable<any> {
    return this._http.post(this.BesUrl + '/password-update', data, { 'headers': this.headers });
  };

  gstApi():Observable<any> {
    return this._http.get(this.BesUrl + '/gst_details_dummy');
  };

  getSecurityQue():Observable<any> {
    return this._http.get(this.BesUrl + '/get_security_questions');
  };

  clearNoti(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/clear_notification', request);
  };
  
  forgetPass(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/password-email',  request, { 'headers': this.headers });
  };

  checkEmail(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/chk_email',  request);
  };

  forceLogOut(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/force_logout',  request);
  };

  setSecurityQu(request:any):Observable<any> {
    return this._http.post('https://beas.in/tsml-microservice/register/api/save_security_qst_ans',  request,{ 'headers': this.headers });
  };

  matchSecurityQu(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/security_qstn_match',  request);
  };

  emailSecurityQu(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/security_qstn_mail',  request);
  };

  passwordReset(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/password-reset',  request, { 'headers': this.headers });
  };

  getOtpMobile(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/update-mobile-number',  request, { 'headers': this.headers });
  };

  verifyMobile(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/user/update-mobile-user',  request, { 'headers': this.headers });
  };

  save_token(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/get_save_token',  request);
  };

  getOtpLog(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/send-login-otp',  request, { 'headers': this.headers });
  };

  checkExpireyUser(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/regis_date_log',  request);
  };

  resetOtp(request:any):Observable<any> {
    return this._http.post(this.BesUrl + '/resest_pass_mail',  request, { 'headers': this.headers });
  };

}
