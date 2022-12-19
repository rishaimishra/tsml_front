import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-view-do',
  templateUrl: './view-do.component.html',
  styleUrls: ['./view-do.component.scss']
})
export class ViewDoComponent implements OnInit {
  soList: any = [];
  userByRole: any;

  constructor(private _products: ProductsService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private _router: Router) { }

  ngOnInit(): void {
    let userType = localStorage.getItem('USER_TYPE');
    this.userByRole = userType;
    let userId = localStorage.getItem('USER_ID');

    if (userType == 'PLANT') {
      this.getPlantList(userId);
    }
    else if (userType == 'C') {
      this.getDoByCust(userId);
    }
    else if (userType == 'Kam') {
      this.getDoByKam(userId);
    }
  }
  getPlantList(plantId:any) {
    this._spinner.show();
    this._products.getMethod('/user/get_all_do/'+plantId).subscribe((res: any) => {
      this._spinner.hide();
      if (res.message == 'success') {
        this.soList = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  };
  getDoByCust(plantId:any) {
    this._spinner.show();
    this._products.getMethod('/user/get_do_by_cus/'+plantId).subscribe((res: any) => {
      this._spinner.hide();
      if (res.message == 'success') {
        this.soList = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  };

  getDoByKam(plantId:any) {
    this._spinner.show();
    this._products.getMethod('/user/get_do_by_cam/'+plantId).subscribe((res: any) => {
      this._spinner.hide();
      if (res.message == 'success') {
        this.soList = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  }

    onAdd(){
      this._router.navigateByUrl("/plant/do-entry");
    }
    onView(do_id: any) {
      this._router.navigateByUrl("/plant/do-details/"+do_id);
    }

}
