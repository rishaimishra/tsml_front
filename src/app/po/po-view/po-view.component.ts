import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';
import { ProductsService } from 'src/app/service/products.service';
import { StateCityService } from 'src/app/service/state-city.service';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';
declare var $: any;
import { environment } from 'src/environments/environment';
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js'


@Component({
  selector: 'app-po-view',
  templateUrl: './po-view.component.html',
  styleUrls: ['./po-view.component.scss']
})
export class PoViewComponent implements OnInit {

  userType: boolean = true;
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
  days: any = 30;
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
  categori:any = [];

  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  po_id: any;
  submitt: boolean = false;
  letterHead: any;
  letterHeadFile: boolean = false;
  letterHedFile: any;
  poInfo: any;
  leaterheadFile: any;
  radioValue: any;
  poStatus: any;
  amndNomber: any;
  deliveryDropList: any;
  inputPONum: any = '';
  downloadFile = environment.apiEndpointBase;
  userRole: any;
  isDap: boolean = false;
  afterPrePrice: any;
  userAfterPrePrice: any;
  percentPrice:any;
  poNumber:any;
  poSunnry:any;
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
    private _complains: ComplainsService
  ) {
  }

  ngOnInit(): void {
    this.user_Id = localStorage.getItem('USER_ID');
    let userRol = localStorage.getItem('USER_TYPE');
    this.userRole = localStorage.getItem('USER_TYPE');
    if (userRol == 'Kam') {
      this.userType = false;
    } else {
      this.userType = true;
    }
    this.getDeliveryItem();
    // this.states = this._state.getState();
    this._route.params.subscribe((res) => {
      this.poNumbr = atob(res.id);
      this.categoryid = res.categoryId;
      this.detailByRfq();
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
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.editProductId = decrypted[0]['product_id'];
        let catId = decrypted[0]['cat_id'];
        this.product_data = decrypted;
        this.getCategoriDetails(this.editProductId, catId);
        this.selectedItem.push(this.product_data);
        this.selectedItem = this.product_data;
        this.leaterheadFile = this.product_data[0]['letterhead'];
        this.poStatus = this.product_data[0]['po_st'];
        this.poNumber = this.product_data[0]['user_id'];
        this.amndNomber = this.product_data[0]['amdnt_no'];
        this.rfqNumber = this.product_data[0]['rfq_no'];

        this.catId = this.selectedItem[0].product_id;
        this.show_data = true;
        this.poInfo = this.selectedItem[0];
        for (let i = 0; i < this.selectedItem.length; i++) {
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
          pickup_type: '',
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
    this.getScSoDetails();
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

  goToCustomerPage(id: any) {
    this._router.navigate(['/products/customer', id]);
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
        console.log('addItem', res);
        //return;
        if (res.status == 1) {
          this.product_data = res.result;
          this.selectedItem.push(this.product_data);
          //this.selectedItem=this.product_data;
          console.log('data', this.selectedItem);
          // return;
          this.show_data = true;
          // const uniqueID = uuid.v4();
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
            valid_till: '',
            salesRemarks: '',
            pickup_type: '',
            kamsRemarks: ''
          });

          // let quation_lenght = this.quotation.length - 1;
          let i = this.selectedItem.length - 1;

          this.selectedItem[i]['schedule'] = this.quotation;
          console.log('this.selectedItem=', this.selectedItem);
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

  submitRfq() {
    this.submit = true;
    let rfqFormArry: any = [];
    let poStatusArr: any = [];

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
        rfq_number: this.poNumbr,
        product_id: this.editProductId,
        cat_id: this.selectedItem[i]['cat_id'],
        quantity: qty,
        quote_schedules: form_data_array,
      };

      rfqFormArry.push(reqData);
      // console.log('rfqFormArry=', form_data_array);
    }
    this.spinner.show();
    let password = '123456';
    let encrypted = CryptoJSAesJson.encrypt(rfqFormArry, password);
    this._product.updateRfq(encrypted).subscribe((res: any) => {
      this.spinner.hide();
      if (res.message == 'success') {
        this.detailByRfq();
        this.spinner.hide();
        this._toaster.success(res.result);
        this.poStatusRequest(poStatusArr);
        this._router.navigate(['/po/po-list', this.poNumbr]);
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
  };

  addItem(i: any) {
    // const uniqueID = uuid.v4();
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

  getPrice(location: any, pickup: any, schedule_no: any, shipTo: any, prodId: any, catid: any, size: any, subCatId: any,dlvr:any, i, y) {
    this.firstIndex = i;
    this.lastIndex = y;

    $("#_bptAndfinal" + schedule_no).empty();
    $("#_total" + schedule_no).empty();
    this.schldId = schedule_no;
    if (dlvr == 'DAP (Delivered at Place)') {
      this.isDap = false;
    } else {
      this.isDap = true;
    }
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
        this.afterPrePrice = backendTotal - Number(this.productPrice.price_premium);
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
      else if (this.days == 30) {
        let finalCost = (Number(this.Totalsum) + Number(this.daysCostCount));
        this.Totalsum = finalCost.toFixed(2);
      }
      else if (this.days == 45) {
        let finalCost = (Number(this.Totalsum) + Number(this.daysCostCount));
        this.Totalsum = finalCost.toFixed(2);

      }
    })
  };

  selectDay(event: any, priceSign: any) {
    this.days = event.target.value;
    const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + Number(this.productPrice.delivery_cost) - Number(this.productPrice.cam_discount);
    if (priceSign == '-') {
      this.afterPrePrice = backendTotal - Number(this.productPrice.price_premium);
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
    else if (this.days == 30) {
      let finalCost = (Number(this.Totalsum) + Number(this.daysCostCount));
      this.Totalsum = finalCost.toFixed(2);
    }
    else if (this.days == 45) {
      let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
      this.Totalsum = finalCost.toFixed(2);
    }
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

    const total = (bptPrice + misc_expense + delivery) - _discount;
    //
    if (this.productPrice['price_premium_sing'] == '-') {
      this.userAfterPrePrice = total - Number(price_premium);
    }
    else if (this.productPrice['price_premium_sing'] == '+') {
      this.userAfterPrePrice = total + Number(price_premium);
    }
    else {
      this.userAfterPrePrice = total;
    }
    //
    const hanrateIntrest = Number(_interest) / 100;
    const daysCount = (this.days * hanrateIntrest) / 365;
    const totalDays = daysCount.toFixed(6);
    this.daysCostCountCustomer = (this.userAfterPrePrice * Number(totalDays)).toFixed(2);

    let totalPercent = ((this.Totalsum1 - this.Totalsum) / this.Totalsum) * 100;
    this.percentPrice = totalPercent.toFixed(2);
    if (this.days == 0) {
      this.Totalsum1 = this.userAfterPrePrice;
    }
    else if (this.days == 30) {
      let finalCost = (Number(this.Totalsum1) + Number(this.daysCostCountCustomer));
      this.Totalsum1 = finalCost.toFixed(2);
    }
    else if (this.days == 45) {
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
    // let apiUrl = '/user/view_remarks/' + shcdlNo;
    // this._product.getMethod(apiUrl).subscribe((res: any) => {
    //   if (res.message == 'success') {
    //     this.spinner.hide();
    //     this.messages = res.result;
    //   }
    //   if (res.status == 'Token has Expired') {
    //     this._router.navigate(['/auth/login'])
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
  };
  cancelprice() {
    this.messages = [];
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  };

  poStatusRequest(statusArr: any) {
    this._product.rfqStatusData(statusArr).subscribe((res: any) => {
      if (res.message == 'status updated') {
        // this._toaster.success(res.message);
        this.spinner.hide();
      }
      else {
        this._toaster.error(res.message);
      }

    })
  };

  raiseComplain(poId: any, date: any) {
    let data: any = [];
    data = [poId, date];
    this._complains.sendData(data);
    this._router.navigate(['/complains/complaints']);
  };

  viewComplain(poNo: any) {
    this.spinner.hide();
    this._router.navigate(['/complains/kam-reply', poNo]);
  };

  selectRadio(event: any) {
    this.radioValue = event.target.value;
  };

  submitStatus() {
    let statusReq = {
      "po_no": this.poNumbr,
      "status": this.radioValue
    }
    this._product.acceptOrRejectPO(statusReq).subscribe((res: any) => {
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
  getDeliveryItem() {
    this._product.getDeliveryMethod().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.deliveryDropList = res.result;
      }
    })
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
  };

  submitPoAttachment() {
    if (this.inputPONum == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'PO number is required!',
      })
      return;
    }
    this.spinner.show();
    const fileData = new FormData();
    fileData.append('po_no', this.poNumbr);
    fileData.append('letterhead', this.letterHedFile);
    fileData.append('cus_po_no', this.inputPONum);
    let apiUrl = '/user/count_cus_po/' + this.inputPONum;
    this._complains.getMethod(apiUrl).subscribe((res: any) => {
      if (res.status == 1 && res.result == 1) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'PO Number Already Exist!',
        })
        return;
      } else {
        this._product.poAttachmentUpl(fileData).subscribe((res: any) => {
          this.spinner.hide();
          if (res.status == 1 && res.message == 'success') {
            Swal.fire({
              position: 'top',
              icon: 'success',
              text: 'PO Updated',
              showConfirmButton: false,
              timer: 1500
            });
            let userId = localStorage.getItem('USER_ID');
            let salesNotiReq = {
              "desc_no": this.inputPONum,
              "user_id": userId,
              "desc": 'Customer PO No. generated',
              "url_type": 'P',
              "sender_id": this.poNumber
            }
            this._product.custNotiSubmit(salesNotiReq).subscribe((res:any) => {
            })

            let plantNotiReq = {
              "desc_no": this.inputPONum,
              "user_id": userId,
              "desc": 'PO has been generated for sales contract',
              "rfq_no": this.rfqNumber
            }
            this._product.plantNotiSubmit(plantNotiReq).subscribe((res:any) => {
            })

            this._router.navigate(['/po/po-list']);
          }
        }, err => {
          console.log(err);
          this.spinner.hide();
        })
      }
    })
  };

  getCategoriDetails (productId:any, catId:any) {
    let categoryFilter = {
      product_id: productId
    }
    console.log('productId',productId, 'catId',catId);
    this._product.filterProducts(categoryFilter).subscribe((res: any) => {
      if (res.success == true) {
        this.categori = res.getCategory;
        this.removeCat(catId);
        this.spinner.hide();
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  removeCat(i:any) {
    let indx = this.categori.findIndex((item: any) => item.id == i);
    if (indx !== -1) {
      this.categori.splice(indx, 1);
    }
  };

  getScSoDetails() {
    let apiUrl = '/user/get_po_summary/'+this.poNumbr;
    this._product.getMethod(apiUrl).subscribe((res:any) => {
      if(res.status ==1) {
        this.poSunnry = res.result;
      }
    })
  }

}
