import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import { StateCityService } from 'src/app/service/state-city.service';
import Swal from 'sweetalert2';
declare var $: any;


@Component({
  selector: 'app-po-edit',
  templateUrl: './po-edit.component.html',
  styleUrls: ['./po-edit.component.scss']
})
export class PoEditComponent implements OnInit {

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
  poNumbr: any;
  selectedItem: any = [];
  // states: any;
  remarks: any = '';
  quantity1: any = [];
  quantity2: any;
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

  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  po_id: any;
  submitt: boolean = false;
  letterHead: any;
  letterHeadFile: boolean = false;
  letterHedFile: any;
  poInfo:any;
  rfqNumber:any;
  percentPrice:any;
  afterPrePrice:any;
  userAfterPrePrice:any;
  categoryId:any;

  pickupType:any;
  afterDiscount:any;
  sub_catId :any;
  sizes :any;
  schedule_no :any;
  plant_location :any;
  compPrice:any;
  tsmlPriceArr: any = [];
  plusMinus:any;
  daysVal:any;
  getDays:any;
  daysCal:any;
  totalValue:any;
  isDap: boolean = false;
  creditDays: any = [];
  plantSelectArr:any = [];
  subCategory:any;
  plantAddrr:any;
  isSchduleArr:any = [];
  locationState:any = [];
  locationRes:any;
  prodcutSize:any;
  billto: any = [];
  shipto: any = [];


  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService,
    private _toaster: ToastrService,
    private _state: StateCityService,
    private _fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    let userRol = localStorage.getItem('USER_TYPE');
    if (userRol == 'Kam') {
      this.userType = false;
    } else {
      this.userType = true;
    }
    this.user_Id = localStorage.getItem('USER_ID');
    // this.states = this._state.getState();
    this._route.params.subscribe((res) => {
      this.poNumbr = atob(res.id);

      this.categoryid = res.categoryId;
      this.detailByRfq();
      this.getLocation();
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
    let url = '/user/get_po_by_id' + '/' + this.poNumbr;
    this.productService.getMethod(url).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1) {
        this.editProductId = res.result[0]['product_id'];
        this.product_data = res.result;
        this.selectedItem.push(this.product_data);
        this.selectedItem = this.product_data;
        this.rfqNumber = this.product_data[0]['rfq_no'];
        this.catId = this.selectedItem[0].product_id;
        this.poInfo = this.selectedItem[0];
        this.show_data = true;
        for (let i = 0; i < this.selectedItem.length; i++) {
          this.categoryId = this.selectedItem[i]['cat_id'];
          let form_data_array = this.selectedItem[i]['schedule'];
          this.showButtons = form_data_array.length;
        }

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

  getLocation() {
    this.spinner.show();
    let userId = localStorage.getItem('USER_ID');
    let apiUrl = '/user/get_user_address/' + userId;

    if (userId != '' || userId != null) {
      this._product.getMethod(apiUrl).subscribe((res: any) => {
        this.spinner.hide();
        this.billto = res.result['bill'];
        this.shipto = res.result['ship'];
        // this.userAddr = res.result?.addressone + res.result?.addresstwo + res.result?.city + res.result?.state + res.result?.pincode;
        if (res.status == 'Token has Expired') {
          this._router.navigate(['/auth/login']);
          this.spinner.hide();
        }
      })
    }
  };

  getCategory() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    this.newDate = dd + '-' + mm + '-' + yyyy;

    this.spinner.show();
    let subCatName = {
      product_id: this.catId,
    }
    this._product.filterProducts(subCatName).subscribe((res: any) => {
      if (res.success == true) {
        this.category = res.getCategory;
        this.removeCat(this.categoryId);
        this.spinner.hide();
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  plantSele(event:any, schdlNo:any) {
    this.spinner.show();
    this.plantSelectArr[schdlNo] = event.target.value;

    let indx = this.plantAddrr.find((item: any) => item.name == event.target.value);
    let apiUrl = '/user/get_plant_addr/'+ indx.id;
    this.getSubCategory(this.editProductId, this.catId, indx.id);
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

  getSubCategory(prodId: any, catId: any, plantId:any) {
    this.spinner.show();
    let sizeFilter = {
      product_id: prodId,
      cat_id: catId,
      plant_id: plantId
    }
    this._product.getSubcat(sizeFilter).subscribe((res: any) => {
      this.spinner.hide();
      if (res.message == 'success.') {
        this.subCategory = res.result;

      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  subCatSelect(event: any) {
    this.spinner.show();
    let apiUrl = '/sub_cat_details/' + event.target.value;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1 && res.message == 'success.') {
        this.prodcutSize = res.result['sizes'];
        console.log('ffff',this.prodcutSize);
      }
    }, err => {
      console.log(err);
      this.spinner.show();
    })
  };
  removeCat(i:any) {
    let indx = this.category.findIndex((item: any) => item.id == i);
    if (indx !== -1) {
      this.category.splice(indx, 1);
    }
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

  goToCustomerPage(id: any) {
    this._router.navigate(['/products/customer', id]);
  };
  selecte_size(size: any, index: any) {
    this.selected_size = size;
  };

  selectItems(event: any) {
    let categoryId = event.target.value;
    this.categoryid = event.target.value;
    this.removeCat(categoryId);
    this.spinner.show();
    let url = '/product-details/' + this.editProductId + '/' + categoryId;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status == 1) {
          this.product_data = res.result;
          this.selectedItem.push(this.product_data);
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
            confirm_date: '',
            salesRemarks: '',
            valid_till: '',
            kamsRemarks: ''
          });

          let i = this.selectedItem.length - 1;
          this.selectedItem[i]['schedule'] = this.quotation;
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

  submitRfq() {
    this.submit = true;
    let rfqFormArry: any = [];
    let poStatusArr: any = [];
    let confrmDate = [];

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

          let tantetiveReq = {
            "schedule_no": form_data_array[i]['schedule_no'],
            "confirm_date": form_data_array[i]['confirm_date'],
          }
          confrmDate.push(tantetiveReq);
          let indxId = this.creditDays.findIndex((item: any) => item.id == form_data_array[i]['schedule_no']);
          if (this.creditDays[indxId]?.days == undefined) {
            form_data_array[i]['credit_days'] = '';
          } else {
            form_data_array[i]['credit_days'] = this.creditDays[indxId]?.days;
          }
      }

      let reqData = {
        rfq_number: this.rfqNumber,
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
        this.spinner.hide();
        this._toaster.success(res.result);
        this.poStatusRequest(poStatusArr);
        this._router.navigate(['/po/po-list']);

        if (this.userType == false) {
          const scheduleNo = Math.floor(10 + Math.random() * 90);
          let amendPoReq = {
            "po_no": this.poNumbr,
            "amdnt_no": this.poNumbr + '/'+scheduleNo
          }
          this._product.amendPO(amendPoReq).subscribe((res:any) => {
            console.log(res);
          })
        }
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
    this.submitStatus();
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
    // console.log('this.selectedItem final fn=', this.selectedItem);
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data = this.selectedItem[i]['schedule'];

      for (let k = 0; k < form_data.length; k++) {
        this.quotation_value.push(form_data[k]);
      }
      //this.quotation_value[i] = this.selectedItem[i]['form_data'];
    }
    console.log('this.quotation_value=', this.quotation_value);
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

  getPrice(location: any, pickup: any, schedule_no: any, shipTo:any,prodId:any, catid:any,size:any,subCatId:any,plant:any,dlvr:any, i:any, y:any) {
    this.firstIndex = i;
    this.lastIndex = y;
    this.sub_catId = subCatId;
    this.sizes = size;
    this.schedule_no = schedule_no;
    this.plant_location = location;
    this.pickupType = plant;

    if (dlvr == 'DAP (Delivered at Place)') {
      this.isDap = false;
    } else {
      this.isDap = true;
    }

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
      "size": size,
      "sub_cat_id": subCatId
    }
    // - Number(this.productPrice.cam_discount) + Number(this.productPrice.misc_expense)

    this._product.priceCalculation(price).subscribe((res: any) => {
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
      this.productPrice = res.result;
      const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.delivery_cost) ;
      
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
        this.getDays = this.afterPrePrice;
      } 
      else if (this.days == 30){
        let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
        this.getDays = finalCost.toFixed(2);
      }
      else if (this.days == 45){
        let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
        this.getDays = finalCost.toFixed(2);
      }

      let totl =  Number(this.getDays) + Number(this.productPrice.misc_expense);

      if (this.plusMinus == '-') {
        this.Totalsum =  totl - Number(this.productPrice.cam_discount);
      }
      else {
        this.Totalsum = totl + Number(this.productPrice.cam_discount);
      }
    })
  };

  selectPlusMins(event:any) {
    this.plusMinus = event.target.value;
  };

  selectDay(event: any, priceSign:any) {
    this.days = event.target.value;
      const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.delivery_cost);
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
      this.daysVal = this.afterPrePrice;
    } 
    else if (this.days == 30){
      let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
      this.daysVal = finalCost.toFixed(2);
    }
    else if (this.days == 45){
      let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
      this.daysVal = finalCost.toFixed(2);
    }

    let misc = Number(this.daysVal) + Number(this.productPrice.misc_expense);

    if (this.plusMinus == '-') {
      this.Totalsum =  misc - Number(this.productPrice.cam_discount);
      }
      else {
        this.Totalsum = misc + Number(this.productPrice.cam_discount);
    }

  };

  calculatePrice(id: any) {
    let cam_discount = this.productPrice.cam_discount;
    let deliveryCost = this.productPrice.delivery_cost;
    let miscExpense = this.productPrice.misc_expense;
    let pricePremium = this.productPrice.price_premium;
    this.priceVal.credit_cost_for30_days;
    this.priceVal.credit_cost_for45_days;

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

    this.priceLimit = priceValidator;
    const total = (bptPrice + delivery);
    
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
    // let totalPercent = ((this.totalValue - this.Totalsum) / this.Totalsum )* 100;
    // this.percentPrice = totalPercent.toFixed(2);


    if (this.days == 0) {
      this.daysCal = this.userAfterPrePrice;
    } 
    else if (this.days == 30){
      let finalCost = (Number(this.userAfterPrePrice) + Number(this.daysCostCountCustomer));
      this.daysCal = finalCost.toFixed(2);
    }
    else if (this.days == 45){
      let finalCost = (Number(this.userAfterPrePrice) + Number(this.daysCostCountCustomer));
      this.daysCal = finalCost.toFixed(2);
    }

    let misc = Number(this.daysCal) + Number(misc_expense);

    if (this.plusMinus == '-') {
      this.totalValue =  misc - Number(_discount);
      }
      else if (this.plusMinus == '+'){
        this.totalValue = misc + Number(_discount);
      }
      else {
        this.totalValue = misc + Number(_discount);
      }
    let totalPercent = ((this.totalValue - this.Totalsum) / this.Totalsum )* 100;
    this.percentPrice = totalPercent.toFixed(2);
  };

  priceSave(id: any, firstIndx: any, lastIndx: any) {
    this.selectedItem[firstIndx].schedule[lastIndx].kam_price = this.totalValue;
    $("#camsPrice" + id).val(this.Totalsum1);
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
    $(".kamClass").keypress();
  };

  messageBox(shcdlNo: any) {
    this.spinner.show();
    // let apiUrl = '/user/view_remarks/' + shcdlNo;
    // this._product.getMethod(apiUrl).subscribe((res: any) => {
    //   if (res.message == 'success') {
    //     this.spinner.hide();
    //     this.messages = res.result;
    //   }
    // })
    let userType = localStorage.getItem('USER_TYPE');
    let reqParams = {
      "rfq": this.rfqNumber,
      "sche_no": shcdlNo,
      "user_type": userType
    }
    this._product.remarksList(reqParams).subscribe((res:any) => {
      if (res.message == 'success') {
        this.spinner.hide();
        this.messages = res.result;
      }
    })
  }
  cancelprice() {
    this.messages = [];
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  }

  poStatusRequest (statusArr:any) {
    this._product.rfqStatusData(statusArr).subscribe((res: any) => {
      if (res.message == 'status updated') {
        // this._toaster.success(res.message);
        this.spinner.hide();
      }
      else {
        this._toaster.error(res.message);
      }

    })
  }

  submitStatus() {
    let statusReq = {
      "po_no": this.poNumbr,
      "status": 4
    }
    this._product.acceptOrRejectPO(statusReq).subscribe((res:any) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: 'Updated successully',
        showConfirmButton: false,
        timer: 1500
      })
      this._router.navigate(['/po/po-list']);
    })
  };

}
