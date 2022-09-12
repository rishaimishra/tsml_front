import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { getOptRequest, getOtpResponse } from '../interfaces/mobile-verify';
import { catchError, Observable, throwError } from 'rxjs';
import { RegistrationRequest, RegistrationResponse } from '../interfaces/register-request';
import { verifyOptRequest, verifyOtpResponse } from '../interfaces/verify-otp';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly LOGIN_URL: String = 'login';
  private readonly REGISTER_URL: String = 'register';
  private readonly GET_OTP_URL: String = 'send-mobile-otp';
  private readonly VERIFY_OTP_URL: String = 'verify-mobile-otp';

  // apiBaseUrl = 'http://localhost/dev/tcxapp/';
  private BesUrl = environment.apiEndpointBase;
  constructor(private _http: HttpClient) { }


// register(requestData: RegistrationRequest): Observable<RegistrationResponse> {
//   return this._http.post<RegistrationResponse>(`${environment.apiEndpointBase}/${this.REGISTER_URL}`, requestData);
// };

register(data: any) {
  return this._http.post(this.BesUrl + '/register', data);
};
login(data: any) {
  return this._http.post(this.BesUrl + '/login', data, { withCredentials: true });
};

isLoggedIn () {
  return !!localStorage.getItem('tokenUrl');
}
getOtp(requestData: getOptRequest): Observable < getOtpResponse > {
  return this._http.post<getOtpResponse>(`${environment.apiEndpointBase}/${this.GET_OTP_URL}`, requestData);
};

verifyOtp(requestData: verifyOptRequest): Observable < verifyOtpResponse > {
  return this._http.post<verifyOtpResponse>(`${environment.apiEndpointBase}/${this.VERIFY_OTP_URL}`, requestData);
}
}
