import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import { StateCityService } from 'src/app/service/state-city.service';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';
declare var $: any;

@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.scss']
})
export class PoComponent implements OnInit {

  userType: boolean;
  public product_data: any = '';
  public show_data: boolean = false;
  public qty: Number = 1;
  public selected_size: any = '';
  public delivery_date: any = '';
  public show_error: boolean = false;
  public error_message: String = '';
  addItems: boolean = false;
  user_Id: any;
  title: any = '';
  productId: any;
  selectedItem: any = [];
  states: any;
  remarks: any = '';
  proSize1: any;
  submit: boolean = false;
  categoryid: any;
  showButtons: any;
  messages: any = [];
  productPrice: any;
  catId: any;
  category: any;
  newDate: any;
  priceVal: any;
  priceLimit: any = [];
  days: any = 0;
  Totalsum: any;
  bptAndfinal: any;
  priceForm: FormGroup;
  finalResult: any = 0;
  Totalsum1: any;
  firstIndex: any;
  lastIndex: any;

  bptAndfinal1: any;
  schldId: any;
  userRole:any;

  editProductId: any;
  submitted: boolean = false;
  premiumPrice: boolean = false;
  miscPrice: boolean = false;
  deliveryCost: boolean = false;
  kamDiscount: boolean = false;
  credCost: boolean = false;
  daysCost: any;
  totalDayCost: any;
  daysCostCount: any;
  daysCostCountCustomer: any;
  poRedirectArr: any = [];
  showUpload: boolean = false;

  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  po_id: any;
  submitt: boolean = false;
  letterHead: any;
  letterHeadFile: boolean = false;
  letterHedFile: any;
  deliveryDropList:any;
  percentPrice:any;
  subCategory:any;
  afterPrePrice:any;
  userAfterPrePrice:any;
  rfqUserId:any;
  rfqNumber:any;


  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService,
    private _toaster: ToastrService,
    private _state: StateCityService,
    private _fb: FormBuilder,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('USER_TYPE');
    if (this.userRole == 'Kam') {
      this.userType = false;
    } else {
      this.userType = true;
    }
    this.getDeliveryItem();
    //  this.userType
    this.user_Id = localStorage.getItem('USER_ID');
    this.states = this._state.getState();
    this._route.params.subscribe((res) => {
      this.productId = res.id;
      this.categoryid = res.categoryId;
      this.detailByRfq();
      this.getSubCategory(this.productId);
      this.finalRuotedTsml();
    });
    const val = 'AIT' + Math.floor(1000 + Math.random() * 9000);
    this.po_id = val;

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
    let url = '/user/get_quote_po_by_id' + '/' + this.productId;
    this.productService.getMethod(url).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1) {
        this.editProductId = res.result[0]['product_id'];
        this.product_data = res.result;
        this.rfqUserId = this.product_data[0].user_id;
        this.rfqNumber = this.product_data[0].rfq_no;
        this.selectedItem.push(this.product_data);
        this.selectedItem = this.product_data;
        this.catId = this.selectedItem[0].product_id;
        this.show_data = true;
        for (let i = 0; i < this.selectedItem.length; i++) {
          let form_data_array = this.selectedItem[i]['schedule'];
          this.showButtons = form_data_array.length;
        }
        // const uniqueID = uuid.v4();
        const scheduleNo = Math.floor(1000 + Math.random() * 9000);
        this.quotation.push({
          schedule_no: scheduleNo,
          pro_size: '',
          quantity: '',
          expected_price: '',
          delivery: '',
          plant: '',
          location: '',
          bill_to: '',
          ship_to: '',
          from_date: '',
          to_date: '',
          remarks: '',
          kam_price: '',
          confirm_date: '',
          salesRemarks: '',
          pickup_type: '',
          valid_till: '',
          kamsRemarks: ''
        });

        this.getCategory();
      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status);
        this._router.navigate(['/auth/login']);
      }
      else {
        this.product_data = '';
      }

    })
  };

  getCategory() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.newDate = dd + '-' + mm + '-' + yyyy;

    this.spinner.show();
    let sizeFilter = {
      product_id: this.catId,
    }
    this._product.filterProducts(sizeFilter).subscribe((res: any) => {
      if (res.success == true) {
        this.category = res.getCategory;
        this.spinner.hide();
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };
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
          if (res.status == 1 && res.result == 'Quote deleted') {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            this.spinner.hide();
            this.detailByRfq();
            // this._router.navigate(['/rfq-list']);

          } else {
            this._toaster.error(res.result);
            this.spinner.hide();
          }
        })
      }
    })
  };


  selecte_size(size: any, index: any) {
    this.selected_size = size;
  };

  selectItems(event: any) {
    let categoryId = event.target.value;
    this.categoryid = event.target.value;
    this.spinner.show();
    let url = '/product-details/' + this.editProductId + '/' + categoryId;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        //return;
        if (res.status == 1) {
          this.product_data = res.result;
          this.selectedItem.push(this.product_data);
          //this.selectedItem=this.product_data;
          this.show_data = true;
          const scheduleNo = Math.floor(1000 + Math.random() * 9000);
          this.quotation = [];
          this.quotation.push({
            schedule_no: scheduleNo,
            pro_size: '',
            quantity: '',
            expected_price: '',
            delivery: '',
            plant: '',
            location: '',
            bill_to: '',
            ship_to: '',
            from_date: '',
            to_date: '',
            remarks: '',
            kam_price: '',
            confirm_date:'',
            pickup_type: '',
            salesRemarks: '',
            valid_till: '',
            kamsRemarks: ''
          });

          // let quation_lenght = this.quotation.length - 1;
          let i = this.selectedItem.length - 1;

          this.selectedItem[i]['schedule'] = this.quotation;
          //this.final_form_data();
        } else {
          this.product_data = '';
        }
      }
    );
  };
  sizeOfferd(event: any) {
    this.proSize1 = event.target.value;
  };
  pricaValue() {
    this._product.getPiceValue().subscribe((res: any) => {
      this.priceVal = res.result;
    });
  };
  selectFile(event: any) {
    this.letterHedFile = event.target.files[0];
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.letterHead = reader.result;
    };
    if (file.size >= 5209785) {
      this.letterHeadFile = true;
      event.target.value = null;
      return;
    } else {
      this.letterHeadFile = false;
    }
  }
  uploadLetterHead() {
    // this.submitt = true;
    this.spinner.show();
    const fileData = new FormData();

    fileData.append('rfq_no', this.productId);
    fileData.append('po_no', this.po_id);
    fileData.append('letterhead', this.letterHedFile);
    fileData.append('po_date', this.newDate);

    this._product.uploadLetterHeadFile(fileData).subscribe((res: any) => {
      this.spinner.hide();
      if (res.success) {
        Swal.fire(
          'PO Created!',
          '',
          'success'
        )
      } else {
        this.spinner.hide();
      }
    })
  }
  submitPO() {
    let userRol = localStorage.getItem('USER_TYPE');
    this.submit = true;
    let rfqFormArry: any = [];
    let poStatusArr: any = [];
    if (!this.letterHead && userRol == 'C') {
      Swal.fire('Sorry','Leaterhead is required !');
      return;
    }

    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['schedule'];
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
         let reqParam = {
            "id": form_data_array[i]['schedule_no'],
            "status": 1
          };
          poStatusArr.push(reqParam);
      }

      let reqData = {
        rfq_number: this.productId,
        product_id: this.editProductId,
        cat_id: this.selectedItem[i]['cat_id'],
        quantity: qty,
        quote_type:'',
        quote_schedules: form_data_array,
      };

      rfqFormArry.push(reqData);
    }

    this.spinner.show();
    this._product.updateRfq(rfqFormArry).subscribe((res: any) => {
      this.spinner.hide();
      if (res.message == 'success') {
        this.detailByRfq();
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Updated successully',
          showConfirmButton: false,
          timer: 1500
        })
        this.poStatusRequest(poStatusArr);
        this.uploadLetterHead();
        this._router.navigate(['/po/po-list']);
        this.spinner.hide();
      }
      if (res.message != 'success') {
        this._toaster.error(res.message);
        this.spinner.hide();
      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status, 'Please login again');
        this._router.navigate(['/auth/login']);
        this.spinner.hide();
      }
      else {
        this.spinner.hide();
      }
      
    }, err => {
      console.log(err);
      this.spinner.hide();
    });

    // Cam notification for PO
    let userId = localStorage.getItem('USER_ID');
    let salesNotiReq = {
      "desc_no": this.po_id,
      "user_id": userId,
      "desc": 'PO has been generated',
      "url_type": 'P'
    }
    this._product.camNotification(salesNotiReq).subscribe((res:any) => {
    })
    let statusRequestKam = {
      "rfq_no": this.rfqNumber,
      "quote_closed": '1'
    }
    this._product.storeStatusKam(statusRequestKam).subscribe((res:any) => {
    })
    let statusRequest = {
      "rfq_no": this.rfqNumber,
      "rfq_closed": '1'
    }
    this._product.storeStatusCust(statusRequest).subscribe((res:any) => {
    })

    let orderConfirmReq = {
      "rfq_no": this.rfqNumber,
      "user_id": this.rfqUserId
    }
      this._product.orderConfirmEmail(orderConfirmReq).subscribe((res:any) => {
        console.log(res);
      })

    let rfqStatus = {
      "rfq_no": this.productId,
      "status": 4
    }
    this._product.rfqStatusChange(rfqStatus).subscribe((res:any) => {
      this.spinner.hide();
    })
  };

  addItem(i: any) {
    const scheduleNo = Math.floor(1000 + Math.random() * 9000);
    this.quotation = this.selectedItem[i]['schedule'];
    this.quotation.push({
      schedule_no: scheduleNo,
      pro_size: '',
      quantity: '',
      expected_price: '',
      delivery: '',
      plant: '',
      location: '',
      bill_to: '',
      ship_to: '',
      from_date: '',
      to_date: '',
      remarks: '',
      kam_price: '',
      confirm_date: '',
      pickup_type: '',
      salesRemarks: '',
      valid_till: '',
      kamsRemarks: ''
    });
    this.selectedItem[i]['schedule'] = this.quotation;
    console.log('this.selectedItem=', this.selectedItem);
    this.final_form_data();
  };
  final_form_data() {
    this.quotation_value = [];
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data = this.selectedItem[i]['schedule'];

      for (let k = 0; k < form_data.length; k++) {
        this.quotation_value.push(form_data[k]);
      }
    }
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
    console.log('date', this.nxtDt);

  };

  getPrice(location: any, pickup: any, schedule_no: any, shipTo:any,prodId:any, catid:any,size:any,subCatId:any, i, y) {
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
      "sub_cat_id": subCatId,
      "size": size
    }

    this._product.priceCalculation(price).subscribe((res: any) => {
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
      this.productPrice = res.result;
      const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + 
      Number(this.productPrice.delivery_cost) - Number(this.productPrice.cam_discount);

      if (this.productPrice['price_premium_sing'] == '-') {
        this.afterPrePrice =  backendTotal - Number(this.productPrice.price_premium);
      }
      else if (this.productPrice['price_premium_sing'] == '+') {
        this.afterPrePrice = backendTotal + Number(this.productPrice.price_premium);
      }
      else {
        this.afterPrePrice = backendTotal;
      }
      const backendHanrateIntrest = Number(this.productPrice.interest_rate) / 100;
      const backendDaysCount = (this.days * backendHanrateIntrest) / 365;
      const backDays = backendDaysCount.toFixed(6);
      this.daysCostCount = (this.afterPrePrice * Number(backDays)).toFixed(2);

      if (this.days == 0) {
        this.Totalsum = this.afterPrePrice;
      } 
      else if (this.days == 30){
        let finalCost = (Number(this.Totalsum) + Number(this.daysCostCount));
        this.Totalsum = finalCost.toFixed(2);
      }
      else if (this.days == 45){
        let finalCost = (Number(this.Totalsum) + Number(this.daysCostCount));
        this.Totalsum = finalCost.toFixed(2);

      }
    })
  };

  selectDay(event: any, priceSign:any) {
    // this.days = event.target.value;
    // const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + Number(this.productPrice.delivery_cost) + Number(this.productPrice.price_premium);
    // const backendHanrateIntrest = Number(this.productPrice.interest_rate) / 100;
    // const backendDaysCount = (this.days * backendHanrateIntrest) / 365;
    // this.daysCostCount = (backendTotal * backendDaysCount).toFixed(2);
    // if (this.days == 0) {
    //   this.Totalsum = backendTotal - Number(this.productPrice.cam_discount);
    // } else {
    //   this.Totalsum = ((this.daysCostCount - Number(this.productPrice.cam_discount)) + backendTotal).toFixed(2);
    // }

    this.days = event.target.value;
    const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + Number(this.productPrice.delivery_cost) - Number(this.productPrice.cam_discount);
    if (priceSign == '-') {
    this.afterPrePrice =  backendTotal - Number(this.productPrice.price_premium);
    }
    else if (priceSign == '+') {
      this.afterPrePrice = backendTotal + Number(this.productPrice.price_premium);
    }
    else {
      this.afterPrePrice = backendTotal;
    }
    const backendHanrateIntrest = Number(this.productPrice.interest_rate) / 100;
    const backendDaysCount = (this.days * backendHanrateIntrest) / 365;
    const backDays = backendDaysCount.toFixed(6);
    this.daysCostCount = (this.afterPrePrice * Number(backDays)).toFixed(2);

  if (this.days == 0) {
    this.Totalsum = this.afterPrePrice;
  } 
  else if (this.days == 30){
    let finalCost = (Number(this.Totalsum) + Number(this.daysCostCount));
    this.Totalsum = finalCost.toFixed(2);
  }
  else if (this.days == 45){
    let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
    this.Totalsum = finalCost.toFixed(2);
  }
  };

  calculatePrice(id: any) {
    let cam_discount = this.productPrice.cam_discount;
    let deliveryCost = this.productPrice.delivery_cost;
    let miscExpense = this.productPrice.misc_expense;
    let pricePremium = this.productPrice.price_premium;
    this.productPrice.credit_cost_for30_days;
    this.productPrice.credit_cost_for45_days;

    let bptPrice = Number($("#_bptPrice" + id).val());
    let price_premium = Number($("#price_premium" + id).val());
    let misc_expense = Number($("#misc_expense" + id).val());
    let delivery = Number($("#delivery" + id).val());
    let _credit = Number($("#_credit" + id).val());
    let _interest = Number($("#_interest" + id).val());
    let _discount = Number($("#_discount" + id).val());
    Number($("#_total" + id).val());

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

    const total = (bptPrice + misc_expense + delivery) - _discount;
          //
          if (this.productPrice['price_premium_sing'] == '-') {
            this.userAfterPrePrice =   total - Number(price_premium);
            }
            else if (this.productPrice['price_premium_sing'] == '+') {
              this.userAfterPrePrice =  total + Number(price_premium);
              }
             else {
             this.userAfterPrePrice = total;
            }
        //
    const hanrateIntrest = Number(_interest) / 100;
    const daysCount = (this.days * hanrateIntrest) / 365;
    const totalDays = daysCount.toFixed(6);
    this.daysCostCountCustomer = (this.userAfterPrePrice * Number(totalDays)).toFixed(2);

    let totalPercent = ((this.Totalsum1 - this.Totalsum) / this.Totalsum )* 100;
    this.percentPrice = totalPercent.toFixed(2);
    if (this.days == 0) {
      this.Totalsum1 = this.userAfterPrePrice;
    } 
    else if (this.days == 30){
      let finalCost = (Number(this.Totalsum1) + Number(this.daysCostCountCustomer));
      this.Totalsum1 = finalCost.toFixed(2);
    }
    else if (this.days == 45){
      let finalCost = (Number(this.userAfterPrePrice) + Number(this.daysCostCountCustomer));
      this.Totalsum1 = finalCost.toFixed(2);
    }

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
  messageBox(shcdlNo: any) {
    this.spinner.show();
    let apiUrl = '/user/view_remarks/' + shcdlNo;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      if (res.message == 'success') {
        this.spinner.hide();
        this.messages = res.result;
      }
    })
  };
  cancelprice() {
    this.messages = [];
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  };
  clickBack() {
    this.location.back();
  };
  poStatusRequest (statusArr:any) {
    this._product.rfqStatusData(statusArr).subscribe((res: any) => {
      if (res.message == 'status updated') {
        // this._toaster.success(res.message);
        this.spinner.hide();
      }
      else {
        this._toaster.success(res.message);
      }

    })
  };

  getDeliveryItem () {
    this._product.getDeliveryMethod().subscribe((res:any) => {
      if (res.status == 1 && res.message == 'success') {
        this.deliveryDropList = res.result;
      } 
    })
  };

  getSubCategory(catId:any) {
    this.spinner.show();
    let sizeFilter = {
      cat_id: catId,
    }
    this._product.filterProducts(sizeFilter).subscribe((res: any) => {
      this.spinner.hide();
      if (res.success == true) {
        this.subCategory = res.subCategories;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  finalRuotedTsml() {
    let statusRequest = {
      "rfq_no": this.productId,
      "final_quoted_by_tsml": '1'
    }
    this._product.storeStatusCust(statusRequest).subscribe((res:any) => {
    })
  }
}
