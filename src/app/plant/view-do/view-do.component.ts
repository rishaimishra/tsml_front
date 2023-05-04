import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  doSearchForm: FormGroup
  userID: any;
  constructor(private _products: ProductsService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    let userType = localStorage.getItem('USER_TYPE');
    this.userByRole = userType;
    let userId = localStorage.getItem('USER_ID');
    this.userID = userId;
    if (userType == 'PLANT') {
      this.getPlantList(userId);
    }
    else if (userType == 'C') {
      this.getDoByCust(userId);
    }
    else if (userType == 'Kam') {
      this.getDoByKam(userId);
    }

    this.doSearchForm = this._fb.group({
      so_no: ['', Validators.required],
      do_no: ['', Validators.required],
      do_date: ['', Validators.required],
      cus_po_no: ['', Validators.required],
    })
  }

  doSearch() {
    this._spinner.show();
    console.log(this.doSearchForm.value.so_no, 'this.doSearchForm.value.so_no');
    console.log(this.doSearchForm.value.cus_po_no,' this.doSearchForm.value.cus_po_no');
    let sData = {
       so_no : this.doSearchForm.value.so_no || '',
       cus_po_no : this.doSearchForm.value.cus_po_no || '',
       do_date : this.doSearchForm.value.do_date || '',
       do_no : this.doSearchForm.value.do_no || '',
       id: this.userID || ''
    }
    // if (this.doSearchForm.value.so_no != "") {
      this._products.doListData(sData).subscribe((res: any) => {
        this.soList = res.result;

        this._spinner.hide();
      })
    // } else if (do_no != "") {
    //   this._products.doListData({ do_no: do_no, id: this.userID }).subscribe((res: any) => {
    //     this.soList = res.result;

    //     this._spinner.hide();
    //   })
    // } else if (do_date != "") {
    //   this._products.doListData({ date: do_date, id: this.userID }).subscribe((res: any) => {
    //     this.soList = res.result;

    //     this._spinner.hide();
    //   })
    // } else if (cus_po_no != "") {
    //   this._products.doListData({ cus_po_no: cus_po_no, id: this.userID }).subscribe((res: any) => {
    //     this.soList = res.result;

    //     this._spinner.hide();
    //   })
    // }

  }
  getPlantList(plantId: any) {
    this._spinner.show();
    this._products.doListData({ id: plantId }).subscribe((res: any) => {
      this._spinner.hide();
      console.log(res, 'ressssssssssssss');

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
  getDoByCust(plantId: any) {
    this._spinner.show();
    this._products.getMethod('/user/get_do_by_cus/' + plantId).subscribe((res: any) => {
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

  getDoByKam(plantId: any) {
    this._spinner.show();
    this._products.getMethod('/user/get_do_by_cam/' + plantId).subscribe((res: any) => {
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

  onAdd() {
    this._router.navigateByUrl("/plant/do-entry");
  }
  onView(do_id: any) {
    this._router.navigateByUrl("/plant/do-details/" + do_id);
  }

  
  refresh() {
    //this.ngOnInit();
  // this.getAdminLogData();

    window.location.reload();
  }
  
}
