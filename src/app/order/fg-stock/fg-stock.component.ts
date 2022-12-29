import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fg-stock',
  templateUrl: './fg-stock.component.html',
  styleUrls: ['./fg-stock.component.scss']
})
export class FgStockComponent implements OnInit {
  productionDate:any = '';
  prodFile: any = '';

  constructor(private _sales: SalesService,
    private _spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  productionFile(event:any) {
    this.prodFile = event.target.files[0];
    console.log(this.prodFile);
  }

  submitFg() {
    if (this.productionDate == '' || this.prodFile == '') {
      Swal.fire({
        icon: 'error',
        title: 'Sorry...',
        text: 'Both fields are mandatory',
      })
      return;
    }
    this._spinner.show();
    let fgData = {
      "start": this.productionDate,
      "excel": this.prodFile
    }
    this._sales.uploadFgStock(fgData).subscribe((res:any) => {
      this._spinner.hide();
      console.log(res);
      if(res.status == 1) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          text: 'Production uploaded successfully !',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }, err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Please upload valid file !',
      })
      this._spinner.hide();
    })
  }
}
