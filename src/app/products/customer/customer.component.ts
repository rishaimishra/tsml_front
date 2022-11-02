import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import { DecimalPipe, formatNumber } from '@angular/common';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  userType: boolean;
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
  priceLimit: any = [];
  showButtons: any;
  kamsRemarks: any = '';

  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  editProductId: any;
  submitted: boolean = false;
  premiumPrice: boolean = false;
  miscPrice: boolean = false;
  deliveryCost: boolean = false;
  kamDiscount: boolean = false;
  credCost: boolean = false;
  daysCost: any;
  totalDayCost:any;
  daysCostCount:any;
  daysCostCountCustomer: any;
  messages:any;
  poRedirectArr:any = [];
  percentPrice:any;


  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService,
    private _toaster: ToastrService,
    private _fb: FormBuilder,
    private _state: StateCityService
  ) {$(window).scrollTop(0); }

  ngOnInit(): void {
    
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      this.userType = false;
    } else {
      this.userType = true;
    }

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
      price_premium: ['', Validators.required],
      misc_expense: ['', Validators.required],
      delivery_cost: ['', Validators.required],
      creditCoast: [''],
      interest_rate: [''],
      cam_discount: ['', Validators.required],
      totalSum: [''],
      finalAmt: [''],

    })

    this.pricaValue();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.priceForm.controls;
  }
  getTotalQuantity(cat_id: any) {
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

        this.selectedItem.push(this.product_data);
        this.selectedItem = this.product_data;
        this.show_data = true;
        for (let i = 0; i < this.selectedItem.length; i++) {
          let form_data_array = this.selectedItem[i]['schedule'];
          this.showButtons = form_data_array.length;
        }
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

  getRequote(event: any) {
    let reqParam = {
      "id": event.target.value,
      "status": 'Req'
    };
    let redirectSt = event.target.value.toString();
    // const index: number = this.poRedirectArr.indexOf(event.target.value);
    let indxId = this.poRedirectArr.findIndex((item: any) => item.id == event.target.value);
    if (indxId !== -1) {
      this.poRedirectArr.splice(indxId, 1);
    }
    // if(this.poRedirectArr.hasOwnProperty(redirectSt) == true) {
    //   this.poRedirectArr.splice(redirectSt, 1);
    // }
    this.poRedirectArr.push(reqParam);

    console.log('redirectSt',redirectSt, this.poRedirectArr);
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

    let indxId = this.poRedirectArr.findIndex((item: any) => item.id == id);
    if (indxId !== -1) {
      this.poRedirectArr.splice(indxId, 1);
    }

    const numbersArr = this.requoteArr.map(Number);
    const index: number = numbersArr.indexOf(id);
    if (index !== -1) {
      this.requoteArr.splice(index, 1);
    }

    if (st === 1) {
      let reqStParam = {
        "id": id,
        "status": 'Acpt'
      };
      this.poRedirectArr.push(reqStParam);
    } else {
      let reqStParam = {
        "id": id,
        "status": 'Rej'
      };
      this.poRedirectArr.push(reqStParam);
    };

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
    });
  }
  submitRfq() {
    this.submit = true;
    let rediectStatus = [];
    let countArr = [];
    this.spinner.show();
    let rfqFormArry: any = [];
    // console.log(this.poRedirectArr);
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['schedule'];
      // countArr.push(form_data_array);
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
        countArr.push(form_data_array[i]['schedule_no']);
        console.log('Arry',form_data_array[i]['valid_till']);
        if (form_data_array[i]['valid_till'] == null || form_data_array[i]['valid_till'] == '') {
          this.spinner.hide();
          this._toaster.error('','Valid Till is required');
          return;
        }
      }
      
      let reqData = {
        rfq_number: this.productId,
        product_id: this.editProductId,
        cat_id: this.selectedItem[i]['cat_id'],
        quantity: qty,
        quote_schedules: form_data_array,
      };
      rfqFormArry.push(reqData);

    };
    this.poRedirectArr.forEach(element => {
      rediectStatus.push(element.status);

    });

    this._product.updateRfq(rfqFormArry).subscribe((res: any) => {
      console.log(res);
      if (res.message == 'success') {
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Updated successully',
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

    if ((rediectStatus.includes('Rej') == false &&  rediectStatus.includes('Req') == false) && rediectStatus.length == countArr.length) {
      // const val = 'AIT' + Math.floor(1000 + Math.random() * 9000);
      // let po_id = val;
      this._router.navigate(['/po',this.productId]);
    }
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
      const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + Number(this.productPrice.delivery_cost) + Number(this.productPrice.price_premium);
      const backendHanrateIntrest = Number(this.productPrice.interest_rate) / 100;
      const backendDaysCount = (this.days * backendHanrateIntrest) / 365;
      this.daysCostCount = (backendTotal * backendDaysCount).toFixed(2);

      this.Totalsum = ((this.daysCostCount - Number(this.productPrice.cam_discount)) + backendTotal).toFixed(2);

      // let prcentPrice = (backendTotal - this.productPrice.bpt_price);
      // this.percentPrice = (this.productPrice.bpt_price / prcentPrice).toFixed(2);
  };

  getPrice(location: any, pickup: any, schedule_no: any, i, y) {
    this.firstIndex = i;
    this.lastIndex = y;
    
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
      const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + 
      Number(this.productPrice.delivery_cost) + Number(this.productPrice.price_premium);

      const backendHanrateIntrest = Number(this.productPrice.interest_rate) / 100;
      const backendDaysCount = (this.days * backendHanrateIntrest) / 365;
      this.daysCostCount = (backendTotal * backendDaysCount).toFixed(2);
      console.log(this.daysCostCount);
  
      this.Totalsum = (backendTotal - Number(this.productPrice.cam_discount) + Number(this.daysCostCount)).toFixed(2);
    })
  };


  calculatePrice(id: any) {
    let cam_discount = this.priceVal.cam_discount;
    let deliveryCost = this.priceVal.delivery_cost;
    let miscExpense = this.priceVal.misc_expense;
    let pricePremium = this.priceVal.price_premium;
    let credit_cost_for30_days = this.priceVal.credit_cost_for30_days;
    let credit_cost_for45_days = this.priceVal.credit_cost_for45_days;

    let bptPrice = Number($("#_bptPrice" + id).val());
    let price_premium = Number($("#price_premium" + id).val());
    let misc_expense = Number($("#misc_expense" + id).val());
    let delivery = Number($("#delivery" + id).val());
    let _credit = Number($("#_credit" + id).val());
    let _interest = Number($("#_interest" + id).val());
    let _discount = Number($("#_discount" + id).val());
    let _total = Number($("#_total" + id).val());

    let priceValidator = [];
    if (price_premium < pricePremium && price_premium != 0) {
      priceValidator.push(1);
      this.premiumPrice = true;
    } else {
      this.premiumPrice = false;
    };
    if (misc_expense < miscExpense && misc_expense != 0) {
      this.miscPrice = true;
      priceValidator.push(2);
    } else {
      this.miscPrice = false;
    };
    if (delivery < deliveryCost && delivery != 0) {
      this.deliveryCost = true;
      priceValidator.push(3);
    } else {
      this.deliveryCost = false;
    };
    if (_credit < this.days && _credit != 0) {
      this.credCost = true;
      priceValidator.push(4);
    } else {
      this.credCost = false;
    };
    if (_discount < cam_discount && _discount != 0) {
      this.kamDiscount = true;
      priceValidator.push(5);
    } else {
      this.kamDiscount = false;
    };
    this.priceLimit = priceValidator;
    const total = (bptPrice + misc_expense + delivery) - price_premium;
    const hanrateIntrest = Number(_interest) / 100;
    const daysCount = (this.days * hanrateIntrest) / 365;
    this.daysCostCountCustomer = (total * daysCount).toFixed(2);

    this.Totalsum1 = ((this.daysCostCountCustomer - _discount) + total).toFixed(2);
    let prcentPrice = (this.Totalsum1 - bptPrice);
    this.percentPrice = (bptPrice / prcentPrice).toFixed(2);

  };
  getNegotiationHistory() {
    let apiUrl = '/user/quotes_history/' + this.productId;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      this.negotiationHistory = res.result;
    })
  };

  priceSave(id: any, firstIndx: any, lastIndx: any) {
    if (!this.priceForm.valid) {
      this.submitted = true;
      return;
    };
    $("#camsPrice" + id).val(this.Totalsum1);
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
    $(".kamClass").keypress();
    this.selectedItem[firstIndx].schedule[lastIndx].kam_price = this.Totalsum1;
  };
  messageBox(shcdlNo:any) {
    this.spinner.show();
    let apiUrl = '/user/view_remarks/' + shcdlNo;
    this._product.getMethod(apiUrl).subscribe((res:any) => {
      if (res.message == 'success') {
        this.spinner.hide();
        this.messages = res.result;
      }
    })
  }
  cancelprice() {
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");

  };

  cancelprice2() {
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  }
}
