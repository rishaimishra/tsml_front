import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-planing',
  templateUrl: './order-planing.component.html',
  styleUrls: ['./order-planing.component.scss']
})
export class OrderPlaningComponent implements OnInit {
  orderList:any;
  dispatchPlan:any = [];
  orderPlaningForm: FormGroup;
  dispatchList: any = [];


  constructor(private _complains: ComplainsService,
    private spinner: NgxSpinnerService, private _router: Router,
    private _fb: FormBuilder) 
    { 
      this.orderPlaningForm = this._fb.group({
        start_date: [''],
        end_date: [''],
        plant: [''],
        mat_grp: [''],
        mat_no: [''],
        grade: ['']
      })
    }

  ngOnInit(): void {
    this.OrderPlaning();
  }

  OrderPlaning() {
    this.spinner.show();
    let orderReq = {
      "start_date": '',
      "plant": '',
      "mat_grp": '',
      "mat_no": '',
      "grade": ''
    }
    this._complains.OrderPlaning(orderReq).subscribe((res:any) => {
      this.spinner.hide();
      if (res.status != 0 && res.message == 'success') {
        this.orderList = res.result;
      } 
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
      for (let index = 0; index < this.orderList.length; index++) {
        this.dispatchPlan = this.orderList[index]['dispatch'];
        
      }
    }, err => {
      console.log(err);
      this.spinner.show();
    })
  }
  selectPlant(event:any) {
    let plantSele = event.target.value;
    this.orderPlaningForm.value['plant'] = plantSele;
  }
  searchOrderPlan() {
    var today: any = new Date(this.orderPlaningForm.value['start_date']);
    var startYesr = today.getFullYear();
    var startMonth = today.getMonth() + 1;

    var endToday: any = new Date(this.orderPlaningForm.value['end_date']);
    var endYaer = endToday.getFullYear();
    var endMonth = endToday.getMonth() + 1;

    if (startYesr == endYaer && startMonth == endMonth) {
      this._complains.OrderPlaning(this.orderPlaningForm.value).subscribe((res:any) => {
        this.OrderPlaning();
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Month should be same !',
      })
    }
  }
  onOpenDispatchForm(dispatchList: any) {
    this.dispatchList = dispatchList;
  }

  nxtDt: any;
  setNxtData(event: any, i: any) {
    let day = new Date(event.target.value);

    let nextDay: any = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    var dd = nextDay.getDate();
    var mm = nextDay.getMonth() + 1;

  };
}
