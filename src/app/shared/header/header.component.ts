import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isTokenUrl: any;
  isUserLogIn: boolean = false;
  
  constructor(private _router: Router, private _auth: AuthService,
    private _spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.isTokenUrl = localStorage.getItem('tokenUrl');
    this.isUserLogIn = this._auth.isLoggedIn();
    console.log(this.isUserLogIn);
  }

  // goToregister() {
  //   this._router.navigate(['/register']);
  // }

  logOut() {
    this._spinner.show();
    localStorage.removeItem('tokenUrl');
    this._router.navigate(['/']);
    this._spinner.hide();
  }
}
