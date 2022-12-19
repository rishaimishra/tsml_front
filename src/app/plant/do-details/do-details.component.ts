import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-do-details',
  templateUrl: './do-details.component.html',
  styleUrls: ['./do-details.component.scss']
})
export class DoDetailsComponent implements OnInit {
  soList: any = [];
  materialGradeList: any = [];
  data: any = [];



  constructor(private _products: ProductsService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private activatedRoute:ActivatedRoute,
    private _router: Router) { }

  getSo() {
    this._spinner.show();
    this._products.getMethod('/user/get_all_do').subscribe((res: any) => {
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

  onChangeSo(event: any) {
    this._products.getMethod('/user/get_do_sub_cats/'+event).subscribe((res: any) => {
      if (res.message == 'success') {
        this.materialGradeList = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      var do_id  = params.get("id");
      this._spinner.show();
      var _request = {
        do_id: do_id
      }
      this._products.postMethopd('/user/get-do-details', _request).subscribe((res: any) => {
        this._spinner.hide();
        // if (res.message === 'success') {
          this.onChangeSo(res.result.so_no);
          this.data = res.result;
          
          // this.soList = res.result;
        // }
        if (res.status == 'Token has Expired') {
          this._router.navigate(['/auth/login']);
        }
      }, err => {
        console.log(err);
        this._spinner.hide();
      })
    });
  }

}
