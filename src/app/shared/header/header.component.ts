import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
declare var $: any; 


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isTokenUrl: any;
  isUserLogIn: boolean = false;
  userName: any;
  
  constructor(private _router: Router, private _auth: AuthService,
    private _spinner: NgxSpinnerService, private _toster: ToastrService) { }

  ngOnInit(): void {
    this.isTokenUrl = localStorage.getItem('tokenUrl');
    this.isUserLogIn = this._auth.isLoggedIn();
    this.userName = localStorage.getItem('USER_NAME');
    $( document ).ready(function() {
      $(".shopcut").click(function(){
        $(".shopcutBx").slideToggle("slow");
    });
  });
  }

  // goToregister() {
  //   this._router.navigate(['/register']);
  // }

  logOut() {
    this._spinner.show();
    localStorage.removeItem('tokenUrl');
    this.isUserLogIn = false;
    this.isUserLogIn = false;
    this._toster.success('Logging Out !');
    setTimeout(() => {
      this._spinner.hide();
    }, 1000);
    this._router.navigate(['/']);
  }

  showCart() {
    
  }
}
