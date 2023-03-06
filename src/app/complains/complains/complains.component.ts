import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';
import {environment} from 'src/environments/environment';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-complains',
  templateUrl: './complains.component.html',
  styleUrls: ['./complains.component.scss']
})
export class ComplainsComponent implements OnInit {
  user_Id:any;
  complainsForm: FormGroup;
  submitted: boolean = false;
  categorie: any;
  subCatgri1: any;
  subCatgri2: any;
  subCatgri3: any;
  selectedFile: File;
  poNumber:any;
  poDate:any;
  fileName:any;
  downloadFile = environment.apiEndpointBase;
  maxChars = 500;
  role = '';



  constructor(private _complainse: ComplainsService,
    private _spinner: NgxSpinnerService, private _fb: FormBuilder,
    private _router: Router, private toaster: ToastrService,
    private _product: ProductsService) {
    this.complainsForm = this._fb.group({
      com_cate_id: ['', Validators.required],
      com_sub_cate_id: ['', Validators.required],
      customer_remarks: ['', Validators.required],
      customer_name: [''],
      po_date: [''],
      po_number: [''],
      cust_complain_file: ['']

    })
  }
  get f(): { [key: string]: AbstractControl } {
    return this.complainsForm.controls;
  };
  ngOnInit(): void {
    this.user_Id = localStorage.getItem('USER_ID');
    this._complainse.receiveData().subscribe((res:any) => {
      this.poNumber = res[0];
      this.poDate = res[1]
    })
    this.categories();
  }

  categories() {
    this._spinner.show();
    this._complainse.getCategories().subscribe((res: any) => {
      this._spinner.hide();
      if (res.message == 'success.') {
        this.categorie = res.result;
        this.complainsForm.value.com_cate_id = this.categorie.id;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
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
      this._spinner.hide();
      if (res.message == 'success.') {
        this.complainsForm.value.com_sub_cate_id = catgriId;
        this.subCatgri1 = res.result;
      }
    })
  };

  onSelectFile(event:any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name;

  }
  saveComplains() {
    // this.submitted = true;
    if (this.complainsForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All field are required!',
      })
      return;
    };
    this._spinner.show();
    const fileData = new FormData();
    let frm = this.complainsForm.value;
    fileData.append('com_cate_id', frm.com_cate_id);
    fileData.append('com_sub_cate_id', frm.com_sub_cate_id);
    fileData.append('customer_remarks', frm.customer_remarks);
    fileData.append('user_id', this.user_Id);
    fileData.append('po_date', this.poDate);
    fileData.append('po_number', this.poNumber);
    fileData.append('cust_complain_file', this.selectedFile);

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
        this._router.navigate(['/complains/complaints-list']);
      } 
      if (res.message == 'error' || res.status != 1) {
        this._spinner.hide();
        this.toaster.error(res.message);
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    }, err => {
      console.log(err);
    })
  }
}
