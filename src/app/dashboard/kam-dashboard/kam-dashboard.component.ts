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
  }
  reedirectPage(status:any, rfqNumber:any) {
    console.log(status, rfqNumber);
    if (status == 'Accepted') {
      this._router.navigate(['/po',rfqNumber]);
    } else {
      this._router.navigate(['/rfq-list']);
    }
  }

  getKamItems() {
    this.spinner.show();
    this.dashboard.getKamList().subscribe((res:any) => {
      if(res.message == 'success') {
        this.spinner.hide();
        this.kamItems = res.result;
      };
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/login']);
        this.spinner.hide();
      }

    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }
  getPoListing () {
    this.spinner.show();
    this._product.getPoList().subscribe((res:any) => {
      if(res.message == 'success') {
        this.spinner.hide();
      console.log(res);
      this.poItems = res.result;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }

  getKamPoListing () {
    this.spinner.show();
    this._product.getkamPoList().subscribe((res:any) => {
      if(res.message == 'success') {
        this.spinner.hide();
      console.log(res);
      this.poItems = res.result;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }
}
