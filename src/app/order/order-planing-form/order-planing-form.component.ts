import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComplainsService } from 'src/app/service/complains.service';
import { StateCityService } from 'src/app/service/state-city.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-planing-form',
  templateUrl: './order-planing-form.component.html',
  styleUrls: ['./order-planing-form.component.scss']
})
export class OrderPlaningFormComponent implements OnInit {
  productionForm: FormGroup;
  stateName:any = [];
  submitted: boolean = false;
  poFile: any;



  constructor(private _complains: ComplainsService,
    private _fb: FormBuilder, private _state: StateCityService,
    private _router: Router, private spinner: NgxSpinnerService) 
    { 
      this.productionForm  = this._fb.group({
        start_date:['', Validators.required],
        end_date:['', Validators.required],
        plant:['', Validators.required],
        cat_id:['', Validators.required],
        sub_cat_id:['', Validators.required],
        size:['', Validators.required],
        open_stk:['', Validators.required],
        mnthly_prod:['', Validators.required],
        export:['', Validators.required],
        offline:['', Validators.required],
        sap_order:['', Validators.required]
      })
    }

    get f() { return this.productionForm.controls; }
    
  ngOnInit(): void {
    this.stateName = this._state.getState();

  }

  selectCate(event:any) {
    let categorie = event.target.value;
    this.productionForm.value['cat_id'] = categorie;
  }
  selectSize(event:any) {
    let size = event.target.value;
    this.productionForm.value['size'] = size;
  };
  selectsubCat(event:any) {
    let subCategorie = event.target.value;
    this.productionForm.value['sub_cat_id'] = subCategorie;
  }
  productionSave() {
    this.submitted = true;
    if (this.productionForm.invalid) {
      return;
    }
    this.spinner.show();
  this._complains.saveProduction(this.productionForm.value).subscribe((res:any) => {
    if(res.message == 'success' && res.status != 0) {
      this.spinner.hide();
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: 'Production plan created',
        showConfirmButton: false,
        timer: 1500
      })
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

  poFileUpload(event:any) {
    this.poFile = event.target.files[0];
  }

  submitUpload() {
    const fileData = new FormData();
    fileData.append('excel', this.poFile);
    this._complains.orderPlaningUpload(fileData).subscribe((res:any) => {
      console.log(res);
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: 'File Uploaded Successfully',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
}
