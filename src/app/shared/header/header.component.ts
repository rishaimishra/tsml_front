import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { ProductsService } from 'src/app/service/products.service';
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
  loginFalse: boolean = false;
  
  constructor(private _router: Router, private _auth: AuthService,
    private _spinner: NgxSpinnerService, private _toster: ToastrService,
    private _product: ProductsService) { }

  ngOnInit(): void {
    this.isTokenUrl = localStorage.getItem('tokenUrl');
    this.isUserLogIn = this._auth.isLoggedIn();
    this.userName = localStorage.getItem('USER_NAME');

    $( document ).ready(function() {
      $(".shopcut").click(function(){
        $(".shopcutBx").slideToggle("slow");
    });
  });
  this._product.getAllRequestOfRfq().subscribe((res: any) => {
    console.log(res);
    if(res.status == 'Token has Expired') {
      this.loginFalse = true;
    }
    else {
      console.log(res.status);
    }
  })
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
