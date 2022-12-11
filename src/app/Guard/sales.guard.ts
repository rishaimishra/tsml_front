import { Injectable } from '@angular/core';
import {CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesGuard implements CanActivate {
  currentRole:any;

  constructor (private _auth: AuthService, private _router: Router) {

  }
  canActivate() {
    this.currentRole = localStorage.getItem('USER_TYPE');
      if (this._auth.isLoggedIn()) {
        if (this.currentRole == 'Sales') {
          return true;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You are not authorized to access!',
          })
          this._router.navigate(['/auth/login']);
          return false;
        }
      } else {
        this._router.navigate(['/auth/login']);
        return false;
      };
  }
  
}
