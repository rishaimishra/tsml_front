import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ProductsService } from 'src/app/service/products.service';
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  kamItems:any;
  p: number = 1;
  d: number = 1;
  poItems:any;
  userName:any;
  statusRfq:any = [];
  searchValue:any;
  searchPoValue:any;
  dashItem: any;

  constructor(private dashboard: DashboardService, private spinner: NgxSpinnerService,
    private _router: Router, private _product: ProductsService) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('USER_NAME');
    this.getCustRfqItems();
      this.getPoListing();
    // this.getDashboardValue();
  };

  poSearch() {
    this.spinner.show();
    let poValReq = {
      "search_txt": this.searchPoValue
    }
    this._product.searchPo(poValReq).subscribe((res:any) => {
      this.spinner.hide();
      if (res.status == 1) {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.poItems = decrypted;
      }
    })
  }
  seacrhByrfq() {
    this.spinner.show();
    let searchRequest = {
      "rfq_no": this.searchValue
    }
    this._product.searchRfq(searchRequest).subscribe((res:any) => {
      this.spinner.hide();
      if (res.status == 1) {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.kamItems = decrypted;
      }
    })
  };

  reedirectPage(status:any, rfqNumber:any, kamStatus:any) {
    let rfqNo = btoa(rfqNumber);
    if (status == 'Accepted' && kamStatus != 4) {
      this._router.navigate(['/po/po',rfqNo]);
    }
    else if (kamStatus == 4) {
      this._router.navigate(['/po/po-list'])
    }
    else {
      this._router.navigate(['/products/customer',rfqNo]);
    }
  };

  getCustRfqItems() {
    this.searchValue = '';
    // this.spinner.show();
    this._product.getAllRequestOfRfq().subscribe((res:any) => {
      if(res.message == 'success') {
        this.spinner.hide();

        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.kamItems = decrypted;
        
        const rfqNum = [];
        for (let i = 0; i < this.kamItems.length; i++) {
          let rfqNumbr = this.kamItems[i]['rfq_no'];
          rfqNum.push(rfqNumbr);
        }
        this.getRfqStatus(rfqNum);
      };
      if (res.message == 'not found') {
        this.spinner.hide();
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
        this.spinner.hide();
      }

    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  getRfqStatus(rfqNumbr:any) {
    // this.spinner.show();
    let request = {
      "rfq_no": rfqNumbr
    }
    this._product.getRfqStatusCust(request).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1) {
        this.statusRfq = res.result;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };
  getPoListing () {
    this.searchPoValue = '';
    // this.spinner.show();
    this._product.getPoList().subscribe((res:any) => {
      if(res?.message == 'success') {
        this.spinner.hide();
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
      this.poItems = decrypted;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

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

  getDashboardValue () {
    let userId = localStorage.getItem('USER_ID');
    let params = {
      user_id: userId
    }
    this.dashboard.dashboardItem(params).subscribe((res:any) => {
      console.log(res);
      if(res.status == 1) {
        this.dashItem = res.result;
      }
    })
  }

  redirectPo(poNum:any) {
    let rfqNo = btoa(poNum);
    this._router.navigate(['/po/po-view',rfqNo])
  }
}
