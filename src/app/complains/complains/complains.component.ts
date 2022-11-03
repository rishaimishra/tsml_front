import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complains',
  templateUrl: './complains.component.html',
  styleUrls: ['./complains.component.scss']
})
export class ComplainsComponent implements OnInit {
  user_name:any;
  complainsForm: FormGroup;
  categorie: any;
  subCatgri1: any;
  subCatgri2: any;
  subCatgri3: any;


  constructor(private _complainse: ComplainsService,
    private _spinner: NgxSpinnerService, private _fb: FormBuilder,
    private _router: Router, private toaster: ToastrService) {
    this.complainsForm = this._fb.group({
      com_cate_id: [''],
      com_sub_cate_id: [''],
      com_sub_cate_2id: [''],
      com_sub_cate_3id: [''],
      customer_remarks: [''],
      customer_name: [''],
      complain_file: ['']

    })
  }

  ngOnInit(): void {
    this.user_name = localStorage.getItem('USER_NAME');
    this.categories();
  }
  categories() {
    this._spinner.show();
    this._complainse.getCategories().subscribe((res: any) => {
      if (res.message == 'success.') {
        this._spinner.hide();
        this.categorie = res.result;
        this.complainsForm.value.com_cate_id = this.categorie.id;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/login']);
        this._spinner.hide();
      }
      else {
        this._spinner.hide();
      }
    })
  }

  selectCategories(event: any) {
    this._spinner.show();
    let catgriId = event.target.value;
    let apiKey = '/user/complain-sub-category-list/' + catgriId;
    this._complainse.getMethod(apiKey).subscribe((res: any) => {
      if (res.message == 'success.') {
        this.complainsForm.value.com_sub_cate_id = catgriId;
        this._spinner.hide();
        this.subCatgri1 = res.result;
        console.log('Cat-', this.subCatgri1);
      }
    })
  };

  selectSubCat1(event: any) {
    this._spinner.show();
    let subCatId = event.target.value;
    let apiKey = '/user/complain-sub-category2-list/' + subCatId;
    this._complainse.getMethod(apiKey).subscribe((res: any) => {
      if (res.message == 'success.') {
        this.complainsForm.value.com_sub_cate_2id = subCatId;
        this._spinner.hide();
        this.subCatgri2 = res.result;
        console.log('sabCat-2', this.subCatgri2);
      }
    })
  };

  selectSubCat2(event: any) {
    this._spinner.show();
    let sabCatId2 = event.target.value;
    let apiKey = '/user/complain-sub-category3-list/' + sabCatId2;
    this._complainse.getMethod(apiKey).subscribe((res: any) => {
      if (res.message == 'success.') {
        this.complainsForm.value.com_sub_cate_3id = sabCatId2;
        this._spinner.hide();
        this.subCatgri3 = res.result;
        console.log('sabCat-3', this.subCatgri3);
      } else {
        this._spinner.hide();
      }
    })
  };

  selectSubCat3(event: any) {
    let sabCatId = event.target.value;
    console.log(sabCatId);
  }

  onSelectFile(event:any) {
    // const fileData = new FormData();
    let selectedFile = event.target.files[0];
    // fileData.append('complain_file', selectedFile);
    // this.complainsForm.value.complain_file = fileData;

  }
  saveComplains() {
    this._spinner.show();
    this.complainsForm.value.customer_name = this.user_name;
    this._complainse.storeComplain(this.complainsForm.value).subscribe((res:any) => {
      console.log(res);
      if(res.status == 1 && res.result == 'success') {
        this._spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        });
        this._router.navigate(['/complains-list']);
      } 
      if (res.status == 0) {
        this._spinner.hide();
        this.toaster.error(res.message);
      }
    }, err => {
      console.log(err);
    })
  }
}
