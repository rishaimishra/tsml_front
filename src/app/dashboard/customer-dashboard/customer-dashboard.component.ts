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

  constructor(private dashboard: DashboardService, private spinner: NgxSpinnerService,
    private _router: Router, private _product: ProductsService) { }

  ngOnInit(): void {
    this.getKamItems();
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
}
