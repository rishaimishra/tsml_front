import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {
  kamItems:any;
  poItems:any;

  constructor(private dashboard: DashboardService, private spinner: NgxSpinnerService,
    private _router: Router, private _product: ProductsService) { }

  ngOnInit(): void {
    this.getKamItems();
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      // this.userType = false;
      this.getKamPoListing();
    } else {
      // this.userType = true;
      this.getPoListing();
    }
  }

  getKamItems() {
    this.spinner.show();
    this._product.getAllRequestOfRfq().subscribe((res:any) => {
      if(res.message == 'success') {
        this.spinner.hide();
        this.kamItems = res.result;
      };
      if (res.message == 'not found') {
        this.spinner.hide();
      }
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
