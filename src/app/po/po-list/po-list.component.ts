import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';
declare var $: any;

@Component({
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss']
})
export class PoListComponent implements OnInit {
  userType: boolean;
  poItems:any;
  p: number = 1;

  constructor(private _products: ProductsService, private _spinner:NgxSpinnerService,
    private _router: Router) {
  }

  ngOnInit(): void {
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      this.userType = false;
      this.getKamPoListing();
    } else {
      this.userType = true;
      this.getPoListing();
    }
  };

 
  getPoListing () {
    this._spinner.show();
    this._products.getPoList().subscribe((res:any) => {
      if(res.message == 'success') {
        this._spinner.hide();
      this.poItems = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
        this._spinner.hide();
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  }

  getKamPoListing () {
    this._spinner.show();
    this._products.getkamPoList().subscribe((res:any) => {
      if(res.message == 'success') {
        this._spinner.hide();
      this.poItems = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
        this._spinner.hide();
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  }
}
