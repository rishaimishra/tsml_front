import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  submitted: boolean = false;
  categorie: any;
  subCatgri1: any;
  subCatgri2: any;
  subCatgri3: any;
  selectedFile: File;


  constructor(private _complainse: ComplainsService,
    private _spinner: NgxSpinnerService, private _fb: FormBuilder,
    private _router: Router, private toaster: ToastrService) {
    this.complainsForm = this._fb.group({
      com_cate_id: ['', Validators.required],
      com_sub_cate_id: ['', Validators.required],
      com_sub_cate_2id: ['', Validators.required],
      com_sub_cate_3id: ['', Validators.required],
      customer_remarks: ['', Validators.required],
      customer_name: [''],
      complain_file: ['']

    })
  }
  get f(): { [key: string]: AbstractControl } {
    return this.complainsForm.controls;
  };
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
    this.selectedFile = event.target.files[0];
    

  }
  saveComplains() {
    // this.submitted = true;
    if (this.complainsForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Fields are required',
      })
      return;
    };
    this._spinner.show();
    const fileData = new FormData();
    let frm = this.complainsForm.value;
    fileData.append('com_cate_id', frm.com_cate_id);
    fileData.append('com_sub_cate_id', frm.com_sub_cate_id);
    fileData.append('com_sub_cate_2id', frm.com_sub_cate_2id);
    fileData.append('com_sub_cate_3id', frm.com_sub_cate_3id);
    fileData.append('customer_remarks', frm.customer_remarks);
    fileData.append('customer_name', this.user_name);
    fileData.append('complain_file', this.selectedFile);

    this._complainse.storeComplain(fileData).subscribe((res:any) => {
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
      if (res.message == 'error' || res.status != 1) {
        this._spinner.hide();
        this.toaster.error(res.message);
      }
    }, err => {
      console.log(err);
    })
  }
}
