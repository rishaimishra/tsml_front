import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.scss']
})
export class RfqListComponent implements OnInit {
  rfqList: any = [];
  userType: boolean;
  p: number = 1;


  constructor(private _products: ProductsService,
    private _spinner: NgxSpinnerService,
    private _router: Router, private toaster: ToastrService) { }

  ngOnInit(): void {
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      this.userType = false;
      this.rfqKamListing();
    } else {
      this.userType = true;
      this.rfqListing();
    }

  }


  rfqListing() {
    this._spinner.show();
    this._products.getAllRequestOfRfq().subscribe((res: any) => {
      if (res.status != 0) {
        this._spinner.hide();
        this.rfqList = res.result;
      }
      if (res.status == 'Token has Expired') {
        this.toaster.error(res.status, 'Please login again')
        this._router.navigate(['/auth/login']);
      }
    }) 
  }
  rfqKamListing() {
    this._spinner.show();
    this._products.getAllRfqForKam().subscribe((res: any) => {
      if (res.status != 0) {
        this._spinner.hide();
        this.rfqList = res.result;
      }
      if (res.status == 'Token has Expired') {
        this.toaster.error(res.status, 'Please login again')
        this._router.navigate(['/auth/login']);
      }
    }) 
  }
  goToproductDetails(rfqNo: any, status:any, kamStatus:any) {
    let userType = localStorage.getItem('USER_TYPE');
    if (status == 'Accepted' && kamStatus != 4) {
      this._router.navigate(['/po/po',rfqNo])
    } 
    else if (kamStatus == 4) {
      this._router.navigate(['/po/po-list'])
    }
    else if (userType == 'C') {
      this._router.navigate(['/products/customer',rfqNo]);
    }
    else {
      this._router.navigate(['/products/cam',rfqNo]);
    }
  };

}
