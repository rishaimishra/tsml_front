import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { ProductsService } from 'src/app/service/products.service';
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
  userRol:any;
  notifications: any;
  
  constructor(private _router: Router, private _auth: AuthService,
    private _spinner: NgxSpinnerService, private _toster: ToastrService,
    private _product: ProductsService) 
    { 
      this.checkLogin();
      this.isUserLogIn = this._auth.isLoggedIn();
    }

  ngOnInit(): void {
    this.isTokenUrl = localStorage.getItem('tokenUrl');
    this.userName = localStorage.getItem('USER_NAME');
    this.userRol = localStorage.getItem('USER_TYPE');
    if(this.userRol == 'Kam') {
      this.getCamNoti();
      this.userType = false;
    }
    else if (this.userRol == 'Sales') {
      this.getSalesNoti();
      this.userType = true;
    }
     else {
      this.userType = true;
      this.getCustNoti();
    }

    $( document ).ready(function() {
      $(".shopcut").click(function(){
        $(".shopcutBx").slideToggle("slow");
    });
  });

  }

  clickOnLogo() {
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam' && this.isUserLogIn != false) {
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
        localStorage.removeItem('tokenUrl');
        this.isUserLogIn = false;
        this.isUserLogIn = false;
        this._router.navigate(['/']);
      }
    })
  };
  checkLogin () {
    this._product.getDeliveryMethod().subscribe((res: any) => {
      if(res.status == 'Token has Expired' || res.status == 'Authorization Token not found') {
        this.loginFalse = true;
        localStorage.clear();
      }
    }, err => {
      console.log(err);
    })
  };

  getCamNoti() {
    let userid = localStorage.getItem('USER_ID');
    const apiUrl = '/user/get_cam_notification/'+userid;
    this._product.getMethod(apiUrl).subscribe((res:any) => {
      if (res.status == 1 && res.message == 'success') {
        this.notifications = res.result;
      }
    })
  }
  getSalesNoti() {
    this._product.getSalesNoti().subscribe((res:any) => {
      if (res.status == 1 && res.message == 'success') {
        this.notifications = res.result;
      } 
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    })
  }

  getCustNoti() {
    let userid = localStorage.getItem('USER_ID');
    const apiUrl = '/user/get_cus_notification/'+userid;
    this._product.getMethod(apiUrl).subscribe((res:any) => {
      if (res.status == 1 && res.message == 'success') {
        this.notifications = res.result;
      } 
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    })
  }

  removeNoti(id:any) {
    this._spinner.show();
    let removeNoti = {
      "id": id,
      "status": 2
    }
    if (this.userRol == 'Kam') {
      this._product.removeNotiCam(removeNoti).subscribe((res:any) => {
        this._spinner.hide();
          this.getCamNoti();
        })
    }
    else if (this.userRol == 'Sales') {
      this._product.salesRemoveNoti(removeNoti).subscribe((res:any) => {
        this._spinner.hide();
          this.getCamNoti();
        })
    }
    else {
      this._product.custNotiRemove(removeNoti).subscribe((res:any) => {
        this._spinner.hide();
          this.getCamNoti();
        })
    }
  }
}
