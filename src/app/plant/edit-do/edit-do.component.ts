import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-do',
  templateUrl: './edit-do.component.html',
  styleUrls: ['./edit-do.component.scss']
})
export class EditDoComponent implements OnInit {

  soList: any = [];
  materialGradeList: any = [];
  data: any = [];
  invoiceDate: any;
  despatch_date: any;
  so_no: any;
  doUpdateForm: FormGroup;
  submitted: boolean = false;
  lr_file: any;
  ewaybill: any;
  testCertificate: any;
  eInvoice: any;
  misDoc: any;
  soNum: any;
  miseDoc : any;
  constructor(private _products: ProductsService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder) { 


    }

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
    this._products.getMethod('/user/get_do_sub_cats/' + event).subscribe((res: any) => {
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
      var do_id = params.get("id");
      this._spinner.show();
      var _request = {
        do_id: do_id
      }
      this._products.postMethopd('/user/get-do-details', _request).subscribe((res: any) => {
        this._spinner.hide();
        // if (res.message === 'success') {
        this.onChangeSo(res.result.so_no);
        this.data = res.result;
        // 2023-04-05
        let invoiceDate = this.data.invoice_date.split('-');
        this.invoiceDate = invoiceDate[2] + '-' + invoiceDate[1] + '-' + invoiceDate[0];
        let despatchDate = this.data.despatch_date.split('-');
        this.despatch_date = despatchDate[2] + '-' + despatchDate[1] + '-' + despatchDate[0];
        console.log(this.data, this.invoiceDate, 'this.invoiceDate');

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

    this.doUpdateForm = this._fb.group({
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
      premarks: [],
    })




  }
  updateDo() {
    console.log('+++++++++++++++++');
    
    var userId = localStorage.getItem('USER_ID');
    this.doUpdateForm.get('user_id').setValue(userId);
    console.log('+++++++++++++++++2456789');

    const fileData = new FormData();
    fileData.append("user_id", this.doUpdateForm.value.user_id);
    fileData.append("so_no", this.data.so_no);
    fileData.append("do_no", this.doUpdateForm.value.do_no);
    fileData.append("invoice_no", this.doUpdateForm.value.invoice_no);
    fileData.append("invoice_date", this.doUpdateForm.value.invoice_date);
    fileData.append("invoice_date", this.doUpdateForm.value.invoice_date);
    fileData.append("material_grade", this.data.sub_cat_name);
    fileData.append("do_quantity", this.doUpdateForm.value.do_quantity);
    fileData.append("despatch_date", this.doUpdateForm.value.despatch_date);
    fileData.append("truck_no", this.doUpdateForm.value.truck_no);
    fileData.append("driver_no", this.doUpdateForm.value.driver_no);
    fileData.append("premarks", this.doUpdateForm.value.premarks);
    fileData.append("lr_file", this.lr_file);
    fileData.append("e_waybill_file", this.ewaybill);
    fileData.append("test_certificate_file", this.testCertificate);
    fileData.append("e_invoice_file", this.eInvoice);
    fileData.append("misc_doc_file", this.misDoc);
    fileData.append("plant_id", userId);
    fileData.append("delv_id", this.data.do_id);
    
    console.log(fileData,'fileData');
    
// return
    this._products.postMethopd('/user/update-do', fileData).subscribe((res: any) => {
      this._spinner.hide();
      console.log(res,'res');
      if(res.status == 1){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `${res.message}`,
        })
      }
      // if (res.status == 1) {
      //   this.submitted = false;
      //   this.lr_file = undefined;
      //   this.ewaybill = undefined;
      //   this.testCertificate = undefined;
      //   this.eInvoice = undefined;
      //   this.misDoc = undefined;
      //   this.entryForm.reset();
      //   this.toastr.success(res.message);

      //   this._sales.custDoMail(param).subscribe();
      // } else {
      //   this.toastr.error('Someting went wrong','Sorry');
      // }
      // let statusRequestKam = {
      //   "rfq_no": this.soList[indx].rfq_no,
      //   "do_created": '1'
      // }
      // this._products.storeStatusKam(statusRequestKam).subscribe((res: any) => {
      // })
      // let statusRequest = {
      //   "rfq_no": this.soList[indx].rfq_no,
      //   "do_created": '1'
      // }
      // this._products.storeStatusCust(statusRequest).subscribe((res: any) => {
      // })

      // // Cam notification for PO
      // let userId = localStorage.getItem('USER_ID');
      // let camNotiReq = {
      //   "desc_no": this.soList[indx].rfq_no,
      //   "user_id": userId,
      //   "desc": 'Invoice Uploaded',
      //   "url_type": 'R'
      // }
      // this._products.camNotification(camNotiReq).subscribe((res: any) => {
      // })
      // // let custNotiReq = {
      // //   "desc_no": this.soList[indx].rfq_no,
      // //   "user_id": userId,
      // //   "desc": 'Invoice Generated',
      // //   "url_type": 'R',
      // //   "sender_id": this.entryForm.value.user_id
      // // }
      // // this.setPoStatus(this.soList[indx].po_no);
      // // this._products.custNotiSubmit(custNotiReq).subscribe((res: any) => {
      // // })
      this._router.navigate(['/plant/do-list']);
    }, error => {
      console.log(error)
    })
    
  }

  submit(){

  }

  onGetLrDoc(event: any) {
    console.log(event);
    
    this.lr_file = event.target.files[0];
    let file = event.target.files[0];
    console.log(file,'++++++++++++++++++++++++++++++++++++++');

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
    console.log("File size", file.size);
    this.miseDoc = file.name;
    if (file.size >= 5209785) {
      event.target.value = null;
      return;
    }
  }
}
