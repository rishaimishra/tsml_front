import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';
import { ProductsService } from 'src/app/service/products.service';
import Swal from 'sweetalert2';
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  data: any = [];
  customer_information: any = [];
  customer_kyc: any = [];
  billing_address: any = [];
  shipping_address: any = [];
  documents: any;
  file_link = '';
  custPhoneNo: any = '';
  updateMobile: boolean = false;
  receviedOtp: any = '';
  validMobile: boolean = false;
  mobileNumber: any;
  
  constructor(private _auth: AuthService,
     private spinner: NgxSpinnerService,
     private productService: ProductsService) { }

  ngOnInit(): void {
    this.spinner.show();
    let url = '/user/profile';
    this.productService.getMethod(url).subscribe((res: any) => {
      this.spinner.hide();
      this.file_link = res.file_link;
      this.customer_information = res.customer_information;
      this.customer_kyc = res.customer_kyc;
      this.billing_address = res.billing_address;
      this.shipping_address = res.shipping_address;
      this.documents = res.documents;
      this.custPhoneNo = res.customer_information.phone;

      if (res.message == 'success') {
        this.data = res;
      }
    }, err => {
      console.log(err);
    })
  }

  onUpdateMob(email:any) {
    this.spinner.show();
    var params  ={
      "mobile_no": this.custPhoneNo,
      "email": email,
      "otp": this.receviedOtp
    }

    let password = '123456';
    let encrypted = CryptoJSAesJson.encrypt(params, password);
    this._auth.verifyMobile(encrypted).subscribe((res: any) => {
      this.spinner.hide();
      if (res.success) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        })
        this.updateMobile = false;
      }
      if(res.status == 0) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          text: res.message,
          showConfirmButton: false,
          timer: 4000
        })
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })

  };

  getOtp(email:any) {
    let getOtpParam = {
      "mobile_no": this.custPhoneNo,
      "email": email
    }
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(getOtpParam, passwordd);

    this.spinner.show();
    this._auth.getOtpMobile(encryptedd).subscribe((res:any) => {
      this.spinner.hide();
      if (res.status == 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message,
        })
        this.updateMobile = true;
      }
    else if (res.status == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: res.message,
      })
        return;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  mobilNumCheck(event:any) {
    this.mobileNumber = event.target.value;
    if(this.mobileNumber.length> 10 || this.mobileNumber.length < 10) {
      this.validMobile = true;
    } 
    else if (isNaN(this.mobileNumber)){
      // alert("Please Provide the input as a number");
      this.validMobile = true;
      return false;
   }
    else {
      this.validMobile = false;
    }
  }

}
