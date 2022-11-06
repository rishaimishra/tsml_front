import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';
import { StateCityService } from 'src/app/service/state-city.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dispatch-plan',
  templateUrl: './dispatch-plan.component.html',
  styleUrls: ['./dispatch-plan.component.scss']
})
export class DispatchPlanComponent implements OnInit {
  states: any;
  submit: boolean = false;
  dispatchDate:any = '';
  dispatchQty:any = '';
  dispatchFile: any;
  plant: any;
  categorie: any;
  subCategorie: any;
  size: any;

  dispatch:any;
  stateSele:any;



  constructor(private _complains: ComplainsService, 
    private _state: StateCityService, private spinner: NgxSpinnerService,
    private toster: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.states = this._state.getState();
  }

  fileUpload(event:any) {
    this.dispatchFile = event.target.files[0];
  };

  selectPlant(event:any) {
    this.plant = event.target.value;
  };

  categoriesSelect(event:any) {
    this.categorie = event.target.value;
  };

  selectSubcat(event:any) {
    this.subCategorie = event.target.value;
  };

  selectSize(event:any) {
    this.size = event.target.value;
  };

  submitDispatch() {
    this.submit = true;
    this.spinner.show();
    const fileData = new FormData();

    fileData.append('plant', this.plant);
    fileData.append('category', this.categorie);
    fileData.append('subcategory', this.subCategorie);
    fileData.append('ds_dt', this.dispatchDate);
    fileData.append('ds_qty', this.dispatchQty);
    fileData.append('excel', this.dispatchFile);

    this._complains.storeDispatchPlan(fileData).subscribe((res:any) => {
      this.spinner.hide();
      if (res.success == true) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
      if (res.error) {
        this.toster.error(res.error);
      }
      if (res.status == 'Token has Expired') {
        this.toster.info('Please login again','Login failed');
        this.router.navigate(['/login']);
        this.spinner.hide();
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }
}
