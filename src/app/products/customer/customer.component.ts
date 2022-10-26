import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import { DecimalPipe, formatNumber } from '@angular/common';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StateCityService } from 'src/app/service/state-city.service';
declare var $: any;


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  public product_data: any = '';
  public show_data: boolean = false;
  public qty: Number = 1;
  public selected_size: any = '';
  public delivery_date: any = '';
  public show_error: boolean = false;
  public error_message: String = '';
  user_Id: any;
  addItems: boolean = false;
  title: any = '';
  productId: any;
  selectedItem: any = [];
  states: any;
  deliveryDate1: any = '';
  deliveryDate2: any = '';
  deliveryDate3: any = '';
  deliveryDate4: any = '';
  remarks: any = '';
  remarks2: any = '';
  expectedPrice1: any = '';
  expectedPrice2: any = '';
  quantity1: any = [];
  quantity2: any;
  proSize1: any;
  submit: boolean = false;
  categoryid: any;
  proPrices: any = [];
  requoteArr: any = [];
  statusArr: any = [];
  days: any = 30;
  Totalsum: any;
  bptAndfinal: any;
  priceForm: FormGroup;
  finalResult: any = 0;
  Totalsum1: any;
  bptAndfinal1: any;
  productPrice: any;
  schldId: any;
  firstIndex: any;
  lastIndex: any;
  negotiationHistory: any;
  priceVal: any;
  priceLimit:any = [];

  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  editProductId: any;


  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService,
    private _toaster: ToastrService,
    private _fb: FormBuilder,
    private _state: StateCityService
  ) { }

  ngOnInit(): void {
    $(window).scrollTop(0);
    this.user_Id = localStorage.getItem('USER_ID');
    this._route.params.subscribe(res => {
      if (res.id) {
        this.productId = res.id;
      }
    });
    this.states = this._state.getState();
    this.detailByRfq();
    this.getNegotiationHistory();
    this.priceForm = this._fb.group({
      price_premium: '',
      misc_expense: '',
      delivery_cost: '',
      creditCoast: '',
      interest_rate: '',
      cam_discount: '',
      totalSum: '',
      finalAmt: '',

    })

    this.pricaValue();
  }

  getTotalQuantity(cat_id: any) {
    console.log('cat_id', cat_id);
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['schedule'];
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
      }
      this.totalQty = qty;
    }
    $("#qty_" + cat_id).val(this.totalQty);
  }


  detailByRfq() {
    this.spinner.show();
    let url = '/user/get_quote_by_id' + '/' + this.productId;
    // let url = '/user/get_quote_sche_by_id/' + this.productId;
    this.productService.getMethod(url).subscribe((res: any) => {
      console.log('resss', res);
      this.spinner.hide();
      if (res.message == 'success') {
        this.editProductId = res.result[0]['product_id'];
        this.product_data = res.result;
        console.log('this.product_data=', this.product_data);

        this.selectedItem.push(this.product_data);
        this.selectedItem = this.product_data;
        this.show_data = true;

      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status);
        this._router.navigate(['/login']);
      }
      if (res.result.length < 1) {
        this._router.navigate(['/rfq-list']);
      }
      else {
        this.product_data = '';
      }

    })
  }

  deleteRfqById(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let apiKey = '/user/delete_quote_by_id';
        let apiUrl = apiKey + '/' + id;
        this.productService.getMethod(apiUrl).subscribe((res: any) => {
          console.log(res)
          if (res.status == 1 && res.result == 'Quote deleted') {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            this.detailByRfq();
          } else {
            this._toaster.error(res.result);
            this.spinner.hide();
          }
        })
      }
    })
  }

  goToCustomerPage(id: any) {
    this._router.navigate(['/customer', id]);
  }
  selecte_size(size: any, index: any) {
    this.selected_size = size;
  }
  sizeOffered2(event: any) {
    console.log(event.target.value);
  }

  sizeOfferd(event: any) {
    this.proSize1 = event.target.value;
    console.log(this.proSize1);
  }
  deliveryMethod(event: any) {
    console.log(event.target.value);
  }
  pickupFrom(event: any) {
    console.log(event.target.value);
  }
  deliveryMethod2(event: any) {
    console.log(event.target.value);
  }
  pickupfrome2(event: any) {
    console.log(event.target.value);
  }
  selectlocation2(event: any) {
    console.log(event.target.value);
  }
  billTo2(event: any) {
    console.log(event.target.value);
  }
  shipTo2(event: any) { }

  getRequote(event: any) {
    let indx = this.statusArr.findIndex((item: any) => item.id == event.target.value);
    if (indx !== -1) {
      this.statusArr.splice(indx, 1);
    }

    let checked = event.target.checked;
    if (checked == true) {
      this.requoteArr.push(event.target.value);
    }

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
    // console.log('reqParam', this.statusArr);
  };
  pricaValue() {
    this._product.getPiceValue().subscribe((res: any) => {
      console.log('value', res);
      this.priceVal = res.result;
    })
  }
  submitRfq() {
    this.submit = true;
    this.spinner.show();
    let rfqFormArry: any = [];

    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['schedule'];
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
      }

      let reqData = {
        rfq_number: this.productId,
        product_id: this.editProductId,
        cat_id: this.selectedItem[i]['cat_id'],
        quantity: qty,
        quote_schedules: form_data_array,
      };
      rfqFormArry.push(reqData);

      // if (rfqFormArry[i]['quote_schedules'].quantity == null) {
      //   this._toaster.error('Quantity can not be empty !');
      //   this.submit = true;
      //   this.spinner.hide();
      //   return;
      // }
    }

    this._product.updateRfq(rfqFormArry).subscribe((res: any) => {
      console.log(res);
      if (res.message == 'success') {
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Updated successully',
          showConfirmButton: false,
          timer: 1500
        })
        // status update and reqoute
        if (this.requoteArr.length > 0) {
          this._product.reqouteData(this.requoteArr).subscribe((res: any) => {
            if (res.message == 'status updated') {
              this.spinner.hide();
              // this._toaster.success(res.result);
            } else {
              this._toaster.error(res.message);
            }
          })
        }
        if (this.statusArr.length > 0) {
          this._product.rfqStatusData(this.statusArr).subscribe((res: any) => {
            if (res.message == 'status updated') {
              // this._toaster.success(res.message);
              this.spinner.hide();
            }
            else {
              this._toaster.error(res.message);
            }

          })
        }
      }
      if (res.message == 'error' || res.status == 0) {
        this._toaster.error(res.message);
        this.spinner.hide();
      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status, 'Please login again');
        this._router.navigate(['/login']);
        this.spinner.hide();
      }
      this.detailByRfq();

    }, err => {
      console.log(err);
      this.spinner.hide();
    });

  }

  date: any;
  setFromData() {
    var today: any = new Date();

    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    // var today:any = dd + '/' + mm + '/' + yyyy;
    var today: any = yyyy + '-' + mm + '-' + dd;
    this.date = today;

  };

  nxtDt: any;
  setNxtData(event: any, i: any) {
    let day = new Date(event.target.value);

    let nextDay: any = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    var dd = nextDay.getDate();
    var mm = nextDay.getMonth() + 1;

    var yyyy = nextDay.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    // var today:any = dd + '/' + mm + '/' + yyyy;
    var nextDt: any = yyyy + '-' + mm + '-' + dd;
    this.nxtDt = nextDt;
    $("#to_date_" + i).attr("min", this.nxtDt);
    console.log('date', this.nxtDt);

  };
  selectDay(event: any) {
    this.days = event.target.value;

  }

  getPrice(location: any, pickup: any, schedule_no: any, i, y) {
    this.firstIndex = i;
    this.lastIndex = y;
    console.log(i, 'y', y);
    $("#_bptAndfinal" + schedule_no).empty();
    $("#_total" + schedule_no).empty();
    this.schldId = schedule_no;

    this.priceForm.reset();
    let price = {
      "user_id": this.user_Id,
      "pickup_from": pickup,
      "location": location
    }
    this._product.priceCalculation(price).subscribe((res: any) => {
      this.productPrice = res.result;

      let daysCoast = Number(this.productPrice.credit_cost_for30_days) * Number(this.productPrice.interest_rate) / Number(100);

      let sum = Number(this.productPrice.bpt_price) + Number(this.productPrice.price_premium) + Number(this.productPrice.misc_expense) + Number(this.productPrice.delivery_cost)
        + Number(this.productPrice.credit_cost_for30_days) + Number(daysCoast);

      this.Totalsum = sum - Number(this.productPrice.cam_discount);
      this.bptAndfinal = Number(this.Totalsum) - Number(this.productPrice.bpt_price);
    })
    console.log('Totalsum', this.Totalsum);
    console.log('bptAndfinal', this.bptAndfinal);
  };


  calculatePrice(id: any) {
    console.log(this.priceVal.cam_discount);
    let cam_discount = this.priceVal.cam_discount;
    let delivery_cost = this.priceVal.delivery_cost;
    let miscExpense = this.priceVal.misc_expense;
    let pricePremium = this.priceVal.price_premium;
    let credit_cost_for30_days = this.priceVal.credit_cost_for30_days;
    let credit_cost_for45_days = this.priceVal.credit_cost_for45_days;

    let bptPrice = $("#_bptPrice" + id).val();
    let price_premium = $("#price_premium" + id).val();
    let misc_expense = $("#misc_expense" + id).val();
    let delivery = $("#delivery" + id).val();
    let _credit = $("#_credit" + id).val();
    let _interest = $("#_interest" + id).val();
    let _discount = $("#_discount" + id).val();
    let _total = $("#_total" + id).val();

    let priceValidator = [];
    if (_discount < cam_discount && _discount != '') {
      this._toaster.error('', 'Cam discount should not be less than ' + cam_discount);
      priceValidator.push(1);
    };
    if (price_premium < pricePremium && price_premium != '') {
      this._toaster.error('', 'Price Premium should not be less than ' + pricePremium);
      priceValidator.push(2);
    };
    if (delivery < delivery_cost && delivery != '') {
      this._toaster.error('', 'Delivery cost should not be less than ' + delivery_cost);
      priceValidator.push(3);
    };
    if (_credit < credit_cost_for30_days && _credit != '') {
      this._toaster.error('', 'Credit cost should not be less than ' + credit_cost_for30_days);
      priceValidator.push(4);
    };
    if (misc_expense < miscExpense && misc_expense != '') {
      this._toaster.error('', 'Misc Expense should not be less than ' + miscExpense);
      priceValidator.push(5);
    };
    this.priceLimit =  priceValidator;

    let intPercent = Number(100) + Number(_interest);
    let daysCoast = _credit * intPercent / 100;
    console.log('daysCoast', daysCoast);

    let sum = Number(bptPrice) + Number(price_premium) + Number(misc_expense) + Number(delivery)
      + Number(_credit) + Number(daysCoast);

    this.Totalsum1 = sum - Number(_discount);
    this.bptAndfinal1 = Number(this.Totalsum1) - Number(bptPrice);

  };
  getNegotiationHistory() {
    let apiUrl = '/user/quotes_history/' + this.productId;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      this.negotiationHistory = res.result;
    })
  };

  priceSave(id: any, firstIndx: any, lastIndx: any) {

    $("#camsPrice" + id).val(this.Totalsum1);
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
    $(".kamClass").keypress();
    this.selectedItem[firstIndx].schedule[lastIndx].kam_price = this.Totalsum1;
  };

  cancelprice() {
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");

  }
}
