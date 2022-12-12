import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';
import { ProductsService } from 'src/app/service/products.service';
import Swal from 'sweetalert2';

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
  constructor(private authService: AuthService,
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
    })
  }

  onUpdateMob() {
    let useriD = localStorage.getItem('USER_ID');
    console.log(this.custPhoneNo,useriD)
    this.spinner.show();
    var params  ={
      mobile: this.custPhoneNo,
      kam_id: useriD
    }
    this.productService.postMethopd('/user/phone-update', params).subscribe((res: any) => {
      console.log(res)
      this.spinner.hide();
      if (res.success) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
    // this.productService.getMethod(url).subscribe((res: any) => {
    //   this.spinner.hide();
    //   this.file_link = res.file_link;
    //   this.customer_information = res.customer_information;
    //   this.customer_kyc = res.customer_kyc;
    //   this.billing_address = res.billing_address;
    //   this.shipping_address = res.shipping_address;
    //   this.documents = res.documents;
    //   console.log('Res', res)
    //   if (res.message == 'success') {
    //     this.data = res;
    //   }
    // })
  }

}
