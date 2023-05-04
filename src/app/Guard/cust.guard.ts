import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustGuard implements CanActivate {
  currentRole:any;
  constructor(private _auth: AuthService, private _router: Router) {}

  canActivate() {
    this.currentRole = localStorage.getItem('USER_TYPE');
      if (this._auth.isLoggedIn()) {
        if (this.currentRole == 'C') {
          return true;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You are not authorized to access!',
          })
          //this._router.navigate(['/auth/login']);
          return false;
        }
      } else {
        this._router.navigate(['/auth/login']);
        return false;
      };
  }
  
}
