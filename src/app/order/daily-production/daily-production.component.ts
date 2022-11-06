import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-daily-production',
  templateUrl: './daily-production.component.html',
  styleUrls: ['./daily-production.component.scss']
})
export class DailyProductionComponent implements OnInit {
  startDate: any = '';
  submitt:boolean = false;
  endDate:any = '';
  fg_sap: any = '';
  uploadedFile: any;
  onFileUpld:any;



  constructor(private _complains: ComplainsService,
    private spinner: NgxSpinnerService, private toaster: ToastrService,
    private _router: Router) { }

  ngOnInit(): void {
  }

  fileUplaod(event:any) {
    this.uploadedFile = event.target.files[0];
  }

  submitForm() {
    this.submitt = true;
    if (this.startDate == '' || this.endDate == '' || this.uploadedFile == null || this.fg_sap == '') {
      this.toaster.error('','Feild is required!');
      return;
    }
    this.spinner.show();
    const fileData = new FormData();

    fileData.append('start', this.startDate);
    fileData.append('end', this.endDate);
    fileData.append('fg_sap', this.fg_sap);
    fileData.append('excel', this.uploadedFile);

    this._complains.storeDailyProd(fileData).subscribe((res:any) => {
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
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/login']);
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }

}
