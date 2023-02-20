import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import { DecimalPipe, formatNumber, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StateCityService } from 'src/app/service/state-city.service';
declare var $: any;
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';

@Component({
  selector: 'app-sales-respons',
  templateUrl: './sales-respons.component.html',
  styleUrls: ['./sales-respons.component.scss']
})
export class SalesResponsComponent implements OnInit {

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
  rfqNum: any;
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
  days: any = 0;
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
  remarksData: any = '';
  deleteId:any;
  userByrole:any;
  qtStatusUpdate:any;
  qoutestId:any;
  myForm: FormGroup;
  arr: FormArray;
  showModalIsValue: boolean = false;
  schduleNo: any;
  totlQty: any;
  resData: any;
  deliverySchdule: any = [];
  showCity:any;
  userAddr:any;
  plantAddrr:any;
  deliveryDropList:any;
  locationState:any = [];
  locationRes:any;
  plantSelectArr:any = [];
  selectedUserId:any;
  remarksArry: any = [];


  @ViewChild("remarksModel")
  remarksModel!: { show: () => void; hide: () => void; nativeElement: any };

  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService,
    private _toaster: ToastrService,
    private _fb: FormBuilder,
    private _state: StateCityService,
    private location: Location,
  ) {$(window).scrollTop(0); }

  get ff() { return this.myForm.controls; }
  get t() { return this.f.arr as FormArray; }

  getControl(item: AbstractControl): FormControl { return item as FormControl; }
  
  ngOnInit(): void {
    let userRol = localStorage.getItem('USER_TYPE');
    this.userByrole = userRol;
    if(userRol == 'Kam') {
      this.userType = false;
    } else {
      this.userType = true;
    }
    this.getDeliveryItem();
    this.user_Id = localStorage.getItem('USER_ID');
    this._route.params.subscribe(res => {
      if (res.id) {
        this.rfqNum = atob(res.id);
      }
    });
    // this.getLocation();
    this.states = this._state.getState();
    this.detailByRfq();
    this.setFromData();
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

    this.myForm = this._fb.group({
      arr: this._fb.array([])
    })
  }

  createItem(qty:any,to_date:any) {
    return this._fb.group({
      quantity: [qty],
      to_date: [to_date]

    })
  };

  get f(): { [key: string]: AbstractControl } {
    return this.priceForm.controls;
  };
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
  };


  detailByRfq() {
    this.spinner.show();
    let url = '/user/get_quote_by_id' + '/' + this.rfqNum;
    // let url = '/user/get_quote_sche_by_id/' + this.rfqNum;
    this.productService.getMethod(url).subscribe((res: any) => {
      this.spinner.hide();
      if (res.message == 'success') {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.editProductId = decrypted[0]['product_id'];
        this.selectedUserId = decrypted[0]['user_id'];
        this.product_data = decrypted;
        this.qoutestId = this.product_data[0].quotest;
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
        this._router.navigate(['/auth/login']);
      }
      // if (res.result.length < 1) {
      //   this._router.navigate(['/products/rfq-list']);
      // }
      else {
        this.product_data = '';
      }

    })
  };

  deleteRfqById(qoute_id: any, id:any) {
    this.deleteId = qoute_id;

  };
  submitRemarks() {
    let useriD = localStorage.getItem('USER_ID');
    if (this.remarksData != '') {
      let remarksReq = {
        "quote_id": this.deleteId,
        "kam_id": useriD,
        "remarks": this.remarksData
      }
      this._product.remarksDelet(remarksReq).subscribe ((res:any) => {
        Swal.fire(
          'Canceled!',
          'Your Item has been Canceled.',
          'success'
        )
        this.remarksData = '';
        this.detailByRfq();

      })
    } else {
      this._toaster.error('','Remarks is required!');
    }
  };
  goToCustomerPage(id: any) {
    this._router.navigate(['/products/customer', id]);
  };
  selecte_size(size: any, index: any) {
    this.selected_size = size;
  };

  sizeOfferd(event: any) {
    this.proSize1 = event.target.value;
  };

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
      this.priceVal = res.result;
    });
  };
  selectRadio(event:any) {
    this.qtStatusUpdate = event.target.value;
  };

    addItem() {
      this.arr = this.myForm.get('arr') as FormArray;
      this.arr.push(this.createItem('',''));
    };
    
    removeItem() {
      const remove:any = this.arr;
      remove.removeAt( -1);
    };

    schduleSele(schdlNo: any, qty: any) {
      this.myForm.reset();
      this.schduleNo = schdlNo;
      let apiUrl = '/user/get_quotedel_by_id/' + this.schduleNo;
      this._product.getMethod(apiUrl).subscribe((res: any) => {
        this.showModalIsValue = true;
        this.myForm = this._fb.group({
          arr: this._fb.array([])
        })
        this.resData = res.result;
        this.arr = this.myForm.get('arr') as FormArray;
        for (let i of res.result) {
          this.arr.push(this.createItem(i.qty,i.to_date));
        }
  
      });
      this.totlQty = qty;
      // this.myForm.reset();
    };
    
    onSubmit(totlQty:any) {
      // if (this.myForm.value.arr[0]['quantity'] == '' || this.myForm.value.arr[0]['to_date'] == '') {
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: 'Quantity and Tentative date are required!',
      //   })
      //   return;
      // }
      for (let index = 0; index < this.myForm.value.arr.length; index++) {
        const element = this.myForm.value.arr[index];
        if (element['quantity'] == "" || element['to_date'] == "") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Quantity and Tentative date are required!',
        })
        return;
      }
      }

      let schdlData = this.myForm.value['arr'];
      let setSechdule = {
        "sche_no": this.schduleNo,
        "schedules": schdlData
      }
      let qty = 0;
      for (let i = 0; i < schdlData.length; i++) {
        qty = qty + parseInt(schdlData[i]['quantity']);
      }

      if (qty != totlQty && qty > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Total quantity should not exceed the RFQ quantity!',
          // footer: '<a href="">Why do I have this issue?</a>'
        })
        return;
      }
      $("#createSechdule").hide();
      $('body').removeClass('modal-open');
      $(".modal-backdrop").removeClass("modal-backdrop show");
      this.deliverySchdule.push(setSechdule);
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: 'Added!',
        showConfirmButton: false,
        timer: 1500
      })
      this.myForm.reset();
    };

  submitRfq() {
    this.submit = true;
    if (this.qtStatusUpdate == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select status Accept or Reject!',
      })
      return;
    }

    let userRol = localStorage.getItem('USER_TYPE');
    let countArr = [];
    let confrmDate = [];

    this.spinner.show();
    let rfqFormArry: any = [];
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['schedule'];
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
        countArr.push(form_data_array[i]['schedule_no']);
        if ((form_data_array[i]['valid_till'] == null || form_data_array[i]['valid_till'] == '') && this.userType == false && this.selectedItem[0]['quotest'] == 5) {
          this.spinner.hide();
          this._toaster.error('','Valid Till is required');
          return;
        }

        let tantetiveReq = {
          "schedule_no": form_data_array[i]['schedule_no'],
          "confirm_date": form_data_array[i]['confirm_date'],
        }
        confrmDate.push(tantetiveReq);
        if (form_data_array[i].salesRemarks == null ) {
        return;
      }
      let rmarksParam = {
        rfq_no: this.rfqNum,
        sche_no: form_data_array[i].schedule_no,
        remarks: '',
        camremarks: '',
        salesremarks: form_data_array[i].salesRemarks,
        from: 'Sales',
        to: 'Kam'
      };
      this.remarksArry.push(rmarksParam);
      }

      let reqData = {
        rfq_number: this.rfqNum,
        product_id: this.editProductId,
        cat_id: this.selectedItem[i]['cat_id'],
        quantity: qty,
        quote_type: userRol,
        quote_schedules: form_data_array,
      };
      rfqFormArry.push(reqData);
    };

    let qouteSt = this.selectedItem[0]['quotest'];
    //Encrypt
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(rfqFormArry, passwordd);

    this._product.updateRfq(encryptedd).subscribe((res: any) => {
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
        if(qouteSt == 7) {
          this.salesRemarks();
        }
        this.otherFuncApi();
      }
      else if (res.message == 'error' || res.status == 0) {
        this._toaster.error(res.message);
        this.spinner.hide();
      }
      else if (res.status == 'Token has Expired') {
        this._toaster.error(res.status, 'Please login again');
        this._router.navigate(['/auth/login']);
        this.spinner.hide();
      }
      // if (this.qtStatusUpdate == 5) {
      //   let salesEmailReq = {
      //     "rfq_no": this.rfqNum,
      //     "user_id": this.selectedUserId
      //   }
      //   this._product.salesSubmitedEmail(salesEmailReq).subscribe((res:any) => {
      //     console.log(res);
      //   })
      // }

    }, err => {
      console.log(err);
      this.spinner.hide();
    });
  };

  otherFuncApi() {
    let userId = localStorage.getItem('USER_ID');
    let camNotiReq = {
      "desc": 'Sales reply updated',
      "desc_no": this.rfqNum,
      "user_id": userId,
      "url_type": 'R'
    }
    this._product.camNotification(camNotiReq).subscribe((res:any) => {
      console.log(res);
    })

  this._product.dlvrySchdule(this.deliverySchdule).subscribe((res: any) => {
  });

  let statusRequest = {
    "rfq_no": this.rfqNum,
    "reverted_by_sales_plaing": '1'
  }

  this._product.storeStatusKam(statusRequest).subscribe((res:any) => {
    console.log('status',res);
  });

  let qouteReq = {
    "rfq_no": this.rfqNum,
    "status": this.qtStatusUpdate
  }
  this._product.qouteStatusUpdate(qouteReq).subscribe((res:any) => {
  })
  this._router.navigate(['/products/confirm-rfq']);
  };
  
  salesRemarks() {
    this._product.submitRfqRemarks(this.remarksArry).subscribe((res:any) => {
      console.log(res);
    })
  };

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

  };
  selectDay(event: any) {
    this.days = event.target.value;
      const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + Number(this.productPrice.delivery_cost) + Number(this.productPrice.price_premium);
      const backendHanrateIntrest = Number(this.productPrice.interest_rate) / 100;
      const backendDaysCount = (this.days * backendHanrateIntrest) / 365;
      this.daysCostCount = (backendTotal * backendDaysCount).toFixed(2);
    if (this.days == 0) {
      this.Totalsum = backendTotal - Number(this.productPrice.cam_discount);
    } else {
      this.Totalsum = ((this.daysCostCount - Number(this.productPrice.cam_discount)) + backendTotal).toFixed(2);
    }

      // let prcentPrice = (backendTotal - this.productPrice.bpt_price);
      // this.percentPrice = (this.productPrice.bpt_price / prcentPrice).toFixed(2);
  };

  getPrice(location: any, pickup: any, schedule_no: any, shipTo:any,prodId:any, catid:any,size:any, i, y) {
    this.firstIndex = i;
    this.lastIndex = y;

    $("#_bptAndfinal" + schedule_no).empty();
    $("#_total" + schedule_no).empty();
    this.schldId = schedule_no;
    
    this.priceForm.reset();
    let price = {
      "user_id": this.user_Id,
      "pickup_from": pickup,
      "location": location,
      "destation_location": shipTo,
      "pro_id": prodId,
      "cat_id": catid,
      "size": size
    }
    //Encrypt
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(price, passwordd);
    this._product.priceCalculation(encryptedd).subscribe((res: any) => {
      // Decrypt
      let password = '123456'
      let decrypted = CryptoJSAesJson.decrypt(res.result, password);

      this.productPrice = decrypted;
      const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + 
      Number(this.productPrice.delivery_cost) + Number(this.productPrice.price_premium);

      const backendHanrateIntrest = Number(this.productPrice.interest_rate) / 100;
      const backendDaysCount = (this.days * backendHanrateIntrest) / 365;
      this.daysCostCount = (backendTotal * backendDaysCount).toFixed(2);
      if (this.days == 0) {
        this.Totalsum = backendTotal - Number(this.productPrice.cam_discount);
      } else {
        this.Totalsum = (backendTotal - Number(this.productPrice.cam_discount) + Number(this.daysCostCount)).toFixed(2);
      }
    })
  };


  calculatePrice(id: any) {
    let cam_discount = this.productPrice.cam_discount;
    let deliveryCost = this.productPrice.delivery_cost;
    let miscExpense = this.productPrice.misc_expense;
    let pricePremium = this.productPrice.price_premium;
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

    if (Number(cam_discount) < _discount && _discount != 0) {
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
    let apiUrl = '/user/quotes_history/' + this.rfqNum;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      this.negotiationHistory = res.result;
      console.log(this.negotiationHistory.length)
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
    // let apiUrl = '/user/view_remarks/' + shcdlNo;
    let userType = localStorage.getItem('USER_TYPE');
    let reqParams = {
      "rfq": this.rfqNum,
      "sche_no": shcdlNo,
      "user_type": userType
    }
    this._product.remarksList(reqParams).subscribe((res:any) => {
      if (res.message == 'success') {
        this.spinner.hide();
        this.messages = res.result;
      }
    })
  };
  cancelprice() {
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");

  };

  cancelprice2() {
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  };

  clickBack() {
    this.location.back();
  };

  // getLocation () {
  //   this.spinner.show();
  //   let userId = localStorage.getItem('USER_ID');
  //   let apiUrl = '/user/get_user_address/'+userId;

  //   if(userId != '' || userId != null) {
  //     this._product.getMethod(apiUrl).subscribe((res:any) => {
  //       this.spinner.hide();
  //       this.showCity = res.result.city;
  //       this.userAddr = res.result.addressone + res.result.addresstwo + res.result.city + res.result.state + res.result.pincode;
  //       if (res.status == 'Token has Expired') {
  //         this._router.navigate(['/auth/login']);
  //         this.spinner.hide();
  //       }
  //     })
  //   }
  // };

  plantSele(event:any, schdlNo:any) {
    this.spinner.show();
    this.plantSelectArr[schdlNo] = event.target.value;

    let indx = this.plantAddrr.find((item: any) => item.name == event.target.value);
    let apiUrl = '/user/get_plant_addr/'+ indx.id;
    this._product.getMethod(apiUrl).subscribe((res:any) => {
      this.spinner.hide();
      if (res.status == 1 && res.message == 'success') {
        this.locationState[schdlNo] = res.result['state'];
        this.locationRes = res.result['addressone'] + res.result['addresstwo'] + res.result['city'] + res.result['state'] + '' + res.result['pincode']

      }
    }, err => {
      console.log(err);
      this.spinner.hide()
    })
  };

  selectPlant(event:any, schdleNo:any) {
    this.plantSelectArr[schdleNo] = null;
    this.spinner.show();
    let eventValue = event.target.value;
    $('#pickupTyp_'+schdleNo).val(eventValue);
    let apiUrl = '/user/get_plants_by_type/'+ eventValue;
    if (eventValue != '') {
      this._product.getMethod(apiUrl).subscribe((res:any) => {
        this.spinner.hide();
        if (res.status == 1 && res.message == 'success') {
          this.plantAddrr = res.result;
        }
        if (res.status == 'Token has Expired') {
          this._router.navigate(['/auth/login']);
          this.spinner.hide();
        } 
      })
    }
  };

  getDeliveryItem () {
    this._product.getDeliveryMethod().subscribe((res:any) => {
      if (res.status == 1 && res.message == 'success') {
        this.deliveryDropList = res.result;
      } 
    })
  }
}
