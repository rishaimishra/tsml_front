import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-do-entry',
  templateUrl: './do-entry.component.html',
  styleUrls: ['./do-entry.component.scss']
})
export class DoEntryComponent implements OnInit {
  entryForm: FormGroup;
  submitted: boolean = false;
  lr_file: any;
  ewaybill: any;
  testCertificate: any;
  eInvoice: any;
  misDoc: any;
  soList: any = [];
  materialGradeList: any = [];
  constructor(private _products: ProductsService,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private _spinner: NgxSpinnerService,
    private _router: Router) { }

  getSo() {
    this._spinner.show();
    this._products.getMethod('/user/get_all_so').subscribe((res: any) => {
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
    this._spinner.show();
    this._products.getMethod('/user/get_do_sub_cats/'+event.target.value).subscribe((res: any) => {
      this._spinner.hide();
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
    this.entryForm = this._fb.group({
      user_id: ['', Validators.required],
      so_no: ['', Validators.required],
      do_no: ['', Validators.required],
      invoice_no: ['', Validators.required],
      invoice_date: ['', Validators.required],
      material_grade: ['', Validators.required],
      do_quantity: ['', Validators.required],
      despatch_date: ['', Validators.required],
      truck_no: ['', Validators.required],
      driver_no: ['', Validators.required],
      premarks: ['', Validators.required],
    })
    this.getSo();
  }

  get f() {
    return this.entryForm.controls;
  }

  onGetLrDoc(event: any) {
    this.lr_file = event.target.files[0];
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // this.lr_file = reader.result;
    };
    if (file.size >= 5209785) {
      // Maximum file size:5MB (PDF, PNG, JPG)
      // this.addressProof = true;
      event.target.value = null;
      return;
    }
  }

  onGetEwaybillDoc(event: any) {
    this.ewaybill = event.target.files[0];
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    };
    if (file.size >= 5209785) {
      event.target.value = null;
      return;
    }
  }

  onGetTestCertificate(event: any) {
    this.testCertificate = event.target.files[0];
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    };
    if (file.size >= 5209785) {
      event.target.value = null;
      return;
    }
  }
  onGetEInvoice(event: any) {
    this.eInvoice = event.target.files[0];
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    };
    if (file.size >= 5209785) {
      event.target.value = null;
      return;
    }
  }

  onGetMisDoc(event: any) {
    this.misDoc = event.target.files[0];
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    };
    if (file.size >= 5209785) {
      event.target.value = null;
      return;
    }
  }

  submit() {
    var userId = localStorage.getItem('USER_ID');
    this.entryForm.get('user_id').setValue(userId);
    this.submitted = true;
    if (this.entryForm.invalid == true) {
      return;
    }
    if(this.lr_file == undefined){
      this.toastr.error('', 'Please Upload LR Document');
    } 
    if(this.ewaybill == undefined){
      this.toastr.error('', 'Please Upload e-waybill Document');
    } 
    if(this.testCertificate == undefined){
      this.toastr.error('', 'Please Upload testn certificate Document');
    } 
    if(this.eInvoice == undefined){
      this.toastr.error('', 'Please Upload e-Invoice Document');
    } 
     else {
      const fileData = new FormData();
      fileData.append("user_id", this.entryForm.value.user_id);
      fileData.append("so_no", this.entryForm.value.so_no);
      fileData.append("do_no", this.entryForm.value.do_no);
      fileData.append("invoice_no", this.entryForm.value.invoice_no);
      fileData.append("invoice_date", this.entryForm.value.invoice_date);
      fileData.append("invoice_date", this.entryForm.value.invoice_date);
      fileData.append("material_grade", this.entryForm.value.material_grade);
      fileData.append("do_quantity", this.entryForm.value.do_quantity);
      fileData.append("despatch_date", this.entryForm.value.despatch_date);
      fileData.append("truck_no", this.entryForm.value.truck_no);
      fileData.append("driver_no", this.entryForm.value.driver_no );
      fileData.append("premarks", this.entryForm.value.premarks);
      fileData.append("lr_file", this.lr_file);
      fileData.append("e_waybill_file", this.ewaybill);
      fileData.append("test_certificate_file", this.testCertificate);
      fileData.append("e_invoice_file", this.eInvoice);
      fileData.append("misc_doc_file", this.misDoc);
      fileData.append("plant_id", userId);

      this._spinner.show();
      this._products.postMethopd('/user/store-do', fileData).subscribe((res: any) => {
        this._spinner.hide();
        if (res.status == 1) {
          this.submitted = false;
          this.lr_file = undefined;
          this.ewaybill = undefined;
          this.testCertificate = undefined;
          this.eInvoice = undefined;
          this.misDoc = undefined;
          this.entryForm.reset();
        this.toastr.success(res.message);
        } else {
          this.toastr.error();
        }
        this._router.navigate(['/plant/do-list']);
      }, error => {
        console.log(error)
      })

    }
  }

}
