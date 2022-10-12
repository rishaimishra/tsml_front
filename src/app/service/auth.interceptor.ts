import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable()


export class AuthIntercepto implements HttpInterceptor {

    constructor(private _authService: AuthService,
        private inject: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // return next.handle(req);
        let authService = this.inject.get(AuthService);
        let jwtToken = req.clone({
            setHeaders: {
                Authorization: 'bearer ' + authService.getToken()
            }
        });
        return next.handle(jwtToken);
    }
}