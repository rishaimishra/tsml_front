import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _auth: AuthService, private _router: Router) {}
  canActivate () {
    if (this._auth.isLoggedIn()) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
   
}
  
