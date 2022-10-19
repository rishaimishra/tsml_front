import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
declare var $: any;



@Component({
  selector: 'app-kam',
  templateUrl: './kam.component.html',
  styleUrls: ['./kam.component.scss']
})
export class KamComponent implements OnInit {
  rfqNumber: any;
  kamDetails: any;
  submit: boolean = false;
  states: any;

  btpPrice: number | undefined;
  pricePremium: number | undefined;
  miscExpense: number | undefined;
  deliveryCost: number | undefined;
  creditCost: number | undefined;
  interestRate: number | undefined;
  camDiscount: number | undefined;
  finalPrice: number | undefined;
  btpAndFinal: number | undefined;

  requoteArr: any = [];
  statusArr: any = [];

  sum:any;

  constructor(private _route: ActivatedRoute,
    private _product: ProductsService,
    private _spinner: NgxSpinnerService,
    private _router: Router, private _toaster: ToastrService) { }

  ngOnInit(): void {
    this.getState();
    this._route.params.subscribe(res => {
      if (res.id) {
        this.rfqNumber = res.id;
      }
    })
    this.getRfqDetailById();
    console.log(this.pricePremium);
  }
  setClass(i:any){
    let value = $("#myDIV"+i).attr('class');
    if(value == 'fa fa-plus')
    {
      $(".btn-link").children("i.fa").removeClass("fa-minus").addClass("fa-plus");
      $("#myDIV"+i).removeClass("fa-plus")
      $("#myDIV"+i).addClass("fa-minus");
    }
    else{

      // $("#btnset").children("i.fa").removeClass("fa-minus").addClass("fa-plus");
      $("#myDIV"+i).addClass("fa-plus")
      $("#myDIV"+i).removeClass("fa-minus");
    }

  }

  getState() {
    this.states = [
      {
        key: 'AN',
        name: 'Andaman and Nicobar Islands',
      },
      {
        key: 'AP',
        name: 'Andhra Pradesh',
      },
      {
        key: 'AR',
        name: 'Arunachal Pradesh',
      },
      {
        key: 'AS',
        name: 'Assam',
      },
      {
        key: 'BR',
        name: 'Bihar',
      },
      {
        key: 'CG',
        name: 'Chandigarh',
      },
      {
        key: 'CH',
        name: 'Chhattisgarh',
      },
      {
        key: 'DH',
        name: 'Dadra and Nagar Haveli',
      },
      {
        key: 'DD',
        name: 'Daman and Diu',
      },
      {
        key: 'DL',
        name: 'Delhi',
      },
      {
        key: 'GA',
        name: 'Goa',
      },
      {
        key: 'GJ',
        name: 'Gujarat',
      },
      {
        key: 'HR',
        name: 'Haryana',
      },
      {
        key: 'HP',
        name: 'Himachal Pradesh',
      },
      {
        key: 'JK',
        name: 'Jammu and Kashmir',
      },
      {
        key: 'JH',
        name: 'Jharkhand',
      },
      {
        key: 'KA',
        name: 'Karnataka',
      },
      {
        key: 'KL',
        name: 'Kerala',
      },
      {
        key: 'LD',
        name: 'Lakshadweep',
      },
      {
        key: 'MP',
        name: 'Madhya Pradesh',
      },
      {
        key: 'MH',
        name: 'Maharashtra',
      },
      {
        key: 'MN',
        name: 'Manipur',
      },
      {
        key: 'ML',
        name: 'Meghalaya',
      },
      {
        key: 'MZ',
        name: 'Mizoram',
      },
      {
        key: 'NL',
        name: 'Nagaland',
      },
      {
        key: 'OR',
        name: 'Odisha',
      },
      {
        key: 'PY',
        name: 'Puducherry',
      },
      {
        key: 'PB',
        name: 'Punjab',
      },
      {
        key: 'RJ',
        name: 'Rajasthan',
      },
      {
        key: 'SK',
        name: 'Sikkim',
      },
      {
        key: 'TN',
        name: 'Tamil Nadu',
      },
      {
        key: 'TS',
        name: 'Telangana',
      },
      {
        key: 'TR',
        name: 'Tripura',
      },
      {
        key: 'UK',
        name: 'Uttar Pradesh',
      },
      {
        key: 'UP',
        name: 'Uttarakhand',
      },
      {
        key: 'WB',
        name: 'West Bengal',
      },
    ];
  }
  getRfqDetailById() {
    this._spinner.show();
    let url = '/user/get_quote_sche_by_id/' + this.rfqNumber;
    this._product.getMethod(url).subscribe((res: any) => {
      console.log(res);
      if (res.message == 'success') {
        this.kamDetails = res.result;
        $("#qty_" + this.kamDetails['i']);
        this._spinner.hide();
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/login']);
        this._spinner.hide();
      }
    })
  }

  deleteKam(id: any) {
    this._spinner.show();
    let deleteRq = {
      "sche_id": id
    }
    this._product.deleteKamRfq(deleteRq).subscribe((res: any) => {
      console.log(res);
      if (res.message == 'success') {
        this._spinner.hide();
        this._toaster.success(res.result);
        this.getRfqDetailById();
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  }

  getRequote(event: any) {
    let indx = this.statusArr.findIndex((item: any) => item.id == event.target.value);
    if (indx !== -1) {
      this.statusArr.splice(indx, 1);
    }

    let checked = event.target.checked;
    if (checked == true) {
      this.requoteArr.push(event.target.value);
    }
    console.log('requo', this.requoteArr);
    console.log('reqParam', this.statusArr);

  };

  getStatus(id: any, st: number) {
    const numbersArr = this.requoteArr.map(Number);
    const index: number = numbersArr.indexOf(id);
    if (index !== -1) {
      this.requoteArr.splice(index, 1);
    }
    console.log('requo', this.requoteArr);

    let reqParam = {
      "id": id,
      "status": st
    };
    let indx = this.statusArr.findIndex((item: any) => item.id == id);
    if (indx !== -1) {

      this.statusArr.splice(indx, 1);
      this.statusArr.push(reqParam);
    }
    else {
      this.statusArr.push(reqParam);
    }
    console.log('reqParam', this.statusArr);
  };

  submitReqote() {
    this._spinner.show();
    if (this.requoteArr.length > 0) {
      this._product.reqouteData(this.requoteArr).subscribe((res: any) => {
        if (res.message == 'status updated') {
          // this._toaster.success(res.message);
          this._toaster.success(res.result);
          this._spinner.hide();
        } else {
          this._toaster.error(res.message);
          this._spinner.hide();
        }
      })
    }
    if (this.statusArr.length > 0) {
      this._product.rfqStatusData(this.statusArr).subscribe((res: any) => {
        if (res.message == 'status updated') {
          this._toaster.success(res.message);
          console.log(res);
          this._spinner.hide();
        }
        else {
          this._toaster.error(res.message);
          this._spinner.hide();
        }

      })
    }
  }
}
