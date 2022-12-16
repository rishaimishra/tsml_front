import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-kam-dashboard',
  templateUrl: './kam-dashboard.component.html',
  styleUrls: ['./kam-dashboard.component.scss']
})
export class KamDashboardComponent implements OnInit {
  kamItems:any;
  poItems: any;
  userName:any;
  p: number = 1;
  statusRfq:any = [];

  constructor(private dashboard: DashboardService, private spinner: NgxSpinnerService,
  private _router: Router, private _product: ProductsService) { }

  ngOnInit() {
    this.getKamItems();
    let userRol = localStorage.getItem('USER_TYPE');
    this.userName = localStorage.getItem('USER_NAME');
    if(userRol == 'Kam') {
      // this.userType = false;
      this.getKamPoListing();
    } else {
      // this.userType = true;
      this.getPoListing();
    }
  };

  reedirectPage(status:any, rfqNumber:any, kamStatus:any) {
    if (status == 'Accepted' && kamStatus != 4) {
      this._router.navigate(['/po/po',rfqNumber]);
    }
    else if (kamStatus == 4) {
      this._router.navigate(['/po/po-list'])
    }
    else {
      this._router.navigate(['/products/negotiation',rfqNumber]);
    }
  };

  getKamItems() {
    this.spinner.show();
    this.dashboard.getKamList().subscribe((res:any) => {
      this.spinner.hide();
      if(res.message == 'success') {
        this.spinner.hide();
        this.kamItems = res.result;
        const rfqNum = [];
        for (let i = 0; i < this.kamItems.length; i++) {
          let rfqNumbr = this.kamItems[i]['rfq_no'];
          rfqNum.push(rfqNumbr);
        }
        this.getRfqStatus(rfqNum);
      };
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
        this.spinner.hide();
      }

    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };
  
  getPoListing () {
    this.spinner.show();
    this._product.getPoList().subscribe((res:any) => {
      this.spinner.hide();
      if(res.message == 'success') {
        this.spinner.hide();
      this.poItems = res.result;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };
  getRfqStatus(rfqNumbr) {
    this.spinner.show();
    let request = {
      "rfq_no": rfqNumbr
    }
    this._product.getRfqStatusKam(request).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1) {
        this.statusRfq = res.result;
        console.log(this.statusRfq);
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  getKamPoListing () {
    this.spinner.show();
    this._product.getkamPoList().subscribe((res:any) => {
      this.spinner.hide();
      if(res.message == 'success') {
        this.spinner.hide();
      this.poItems = res.result;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }
}
