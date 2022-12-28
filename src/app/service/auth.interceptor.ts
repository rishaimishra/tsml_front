import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import {environment} from 'src/environments/environment';

@Injectable()


export class AuthIntercepto implements HttpInterceptor {
    sapApiUrl = environment.sapApiEndpointBase;

    constructor(private _authService: AuthService,
        private inject: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authService = this.inject.get(AuthService);
        let jwtToken = req.clone({
            setHeaders: {
                Authorization: 'bearer ' + authService.getToken(),
            }
        });

        let sapApiurl = jwtToken.url.includes(this.sapApiUrl);
        let username = 'MJUNCTION_M_PI_QA';
        let password = 'Welcome';

        let authorizationData = 'Basic ' + btoa(username + ':' + password);
        if (sapApiurl == true) {
            let basicAuth = req.clone({
                setHeaders: {
                    Authorization: 'Basic ' + btoa(authorizationData)
                }
            });
            return next.handle(basicAuth);
        }
        return next.handle(jwtToken);
    }
}