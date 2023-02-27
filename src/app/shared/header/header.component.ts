import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { ProductsService } from 'src/app/service/products.service';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';
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
  userType: boolean;
  userRol: any;
  notifications: any;
  userId: any;

  // Encryption
  tokenFromUI: string = "0123456789123456";
  encrypted: any = "";
  decrypted: string;

  request: string;
  responce: string;


  constructor(private _router: Router, private _auth: AuthService,
    private _spinner: NgxSpinnerService, private _toster: ToastrService,
    private _product: ProductsService, private _sales: SalesService) {
    this.checkLogin();
    this.isUserLogIn = this._auth.isLoggedIn();
  }

  ngOnInit(): void {
    this.isTokenUrl = localStorage.getItem('tokenUrl');
    this.userName = localStorage.getItem('USER_NAME');
    this.userRol = localStorage.getItem('USER_TYPE');
    this.userId = localStorage.getItem('USER_ID');
    this.getTokenInRes(this.userId);

    if (this.userRol == 'Kam') {
      this.getCamNoti();
      this.userType = false;
    }
    else if (this.userRol == 'Sales') {
      this.getSalesNoti();
      this.userType = true;
    }
    else if (this.userRol == 'OPT') {
      this.getPlantMsg();
    }
    else if (this.userRol == 'SM') {
      this.userType = true;
      this.getSHnoti();
    }
    else {
      this.userType = true;
      this.getCustNoti();
    }

    $(document).ready(function () {
      $(".shopcut").click(function () {
        $(".shopcutBx").slideToggle("slow");
      });
    });

  }

  clickOnLogo() {
    let userRol = localStorage.getItem('USER_TYPE');
    if (userRol == 'Kam' && this.isUserLogIn != false) {
      this.userType = false;
      this._router.navigate(['/dashboard/kam-dashboard']);
    }
    else if (userRol == 'Sales' && this.isUserLogIn != false) {
      this._router.navigate(['/dashboard/sales-dashboard']);
    }
    else if (userRol == 'C' && this.isUserLogIn != false) {
      this.userType = true;
      this._router.navigate(['/dashboard/customer-dashboard']);
    } else {
      this._router.navigate(['']);
    }
  };

  logOut() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to logout",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        this._auth.logOut('').subscribe((res: any) => {
          this.isUserLogIn = false;
          this.isUserLogIn = false;
          localStorage.clear();
          this._router.navigate(['/']);
        })
      }
    })
  };

  checkLogin() {
    this._product.getDeliveryMethod().subscribe((res: any) => {
      if (res.status == 'Token is Expired' || res.status == 'Authorization Token not found') {
        this.loginFalse = true;
        localStorage.clear();
      }
    }, err => {
      console.log(err);
    })
  };

  getCamNoti() {
    let userid = localStorage.getItem('USER_ID');
    const apiUrl = '/user/get_cam_notification/' + userid;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.notifications = res.result;
      }
    })
  };

  getSalesNoti() {
    this._product.getSalesNoti().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.notifications = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    })
  };

  getCustNoti() {
    let userid = localStorage.getItem('USER_ID');
    const apiUrl = '/user/get_cus_notification/' + userid;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.notifications = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    })
  };
  getSHnoti() {
    this._sales.getHeadNoti().subscribe((res: any) => {
      if (res.status == 1) {
        this.notifications = res.result;
      }
    })

  };

  getPlantMsg() {
    let userId = localStorage.getItem('USER_ID');
    this._sales.getPlantNoti(userId).subscribe((res: any) => {
    })
  };

  removeNoti(id: any) {
    this._spinner.show();
    let removeNoti = {
      "id": id,
      "status": 2
    }
    if (this.userRol == 'Kam') {
      this._product.removeNotiCam(removeNoti).subscribe((res: any) => {
        this._spinner.hide();
        this.getCamNoti();
      })
    }
    else if (this.userRol == 'Sales') {
      this._product.salesRemoveNoti(removeNoti).subscribe((res: any) => {
        this._spinner.hide();
        this.getSalesNoti();
      })
    }
    else if (this.userRol == 'SM') {
      let apiUrl = '/user/up_sh_notification/'+id;
      this._sales.getMethod(apiUrl).subscribe();
      this.getSHnoti();
      this._spinner.hide();
    }
    else {
      this._product.custNotiRemove(removeNoti).subscribe((res: any) => {
        this._spinner.hide();
        this.getCustNoti();
      })
    }
  };

  clearAllNoti() {
    this._spinner.show();
    if(this.userRol == 'SM') {
      this._sales.clearHedNoti().subscribe();
      this._spinner.hide();
    }
    else {
      let clearMessage = {
        "user_type": this.userRol,
        "user_id": this.userId
      };
      this._auth.clearNoti(clearMessage).subscribe((res: any) => {
        this._spinner.hide();
        this.ngOnInit();
  
        if (res.status == 'Token has Expired') {
          this._router.navigate(['/auth/login'])
        }
      }, err => {
        console.log(err);
        this._spinner.hide();
      })
    }
  };

  forceLogout() {
    let userEmail = localStorage.getItem('USER_EMAIL');
    let reqParams = {
      "email": userEmail
    }
    this._auth.forceLogOut(reqParams).subscribe((res: any) => {
      if (res.success == true) {
        this.isUserLogIn = false;
        this.isUserLogIn = false;
        localStorage.clear();
        this._router.navigate(['/']);
      }
    })
  };

  getTokenInRes(userId: any) {
    let token = localStorage.getItem('tokenUrl');
    let param = {
      "userid": userId
    }

    this._auth.save_token(param).subscribe((res: any) => {
      if (res.success == true) {
        if (res.result.token != token) {
          this.forceLogout();
        }
      }
    })
  };


}
