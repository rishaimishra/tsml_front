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
  showUpload: boolean = false;

  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  po_id: any;
  submitt: boolean = false;
  letterHead: any;
  letterHeadFile: boolean = false;
  letterHedFile: any;


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
    //  this.userType
    this.user_Id = localStorage.getItem('USER_ID');
    this.states = this._state.getState();
    this._route.params.subscribe((res) => {
      this.productId = res.id;
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
    let url = '/user/get_quote_po_by_id' + '/' + this.productId;
    this.productService.getMethod(url).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1) {
        this.editProductId = res.result[0]['product_id'];
        this.product_data = res.result;
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
          valid_till: '',
          kamsRemarks: ''
        });

        this.getCategory();
      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status);
        this._router.navigate(['/login']);
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
  sizeOffered2(event: any) {
    console.log(event.target.value);
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
      console.log('value', res);
      this.priceVal = res.result;
    });
  };
  selectFile(event: any) {
    console.log(event.target.files[0]);
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
      console.log(res);
      if (res.success) {
        this.spinner.hide();
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
  submitRfq() {
    this.submit = true;
    // this.spinner.show();
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
        rfq_number: this.productId,
        product_id: this.editProductId,
        cat_id: this.selectedItem[i]['cat_id'],
        quantity: qty,
        quote_type:'',
        quote_schedules: form_data_array,
      };

      rfqFormArry.push(reqData);
      // console.log('rfqFormArry=', form_data_array);
    }

  
    this._product.updateRfq(rfqFormArry).subscribe((res: any) => {
      if (res.message == 'success') {
        this.detailByRfq();
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Updated successully',
          showConfirmButton: false,
          timer: 1500
        })
        this.poStatusRequest(poStatusArr);
        this.uploadLetterHead();
        this._router.navigate(['/po-list']);
      }
      if (res.message != 'success') {
        this._toaster.error(res.message);
        this.spinner.hide();
      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status, 'Please login again');
        this._router.navigate(['/login']);
        this.spinner.hide();
      }
      else {
        this.spinner.hide();
      }
      
    });

    let rfqStatus = {
      "rfq_no": this.productId,
      "status": 4
    }
    this._product.rfqStatusChange(rfqStatus).subscribe((res:any) => {
      console.log(res);
    })
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

  selectDay(event: any) {
    this.days = event.target.value;
    const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.misc_expense) + Number(this.productPrice.delivery_cost) + Number(this.productPrice.price_premium);
    const backendHanrateIntrest = Number(this.productPrice.interest_rate) / 100;
    const backendDaysCount = (this.days * backendHanrateIntrest) / 365;
    this.daysCostCount = (backendTotal * backendDaysCount).toFixed(2);
    this.Totalsum = ((this.daysCostCount - Number(this.productPrice.cam_discount)) + backendTotal).toFixed(2);
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

    const total = (bptPrice + misc_expense + delivery) - price_premium;
    const hanrateIntrest = Number(_interest) / 100;
    const daysCount = (this.days * hanrateIntrest) / 365;
    this.daysCostCountCustomer = (total * daysCount).toFixed(2);

    this.Totalsum1 = ((this.daysCostCountCustomer - _discount) + total).toFixed(2);

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
  }
  cancelprice() {
    this.messages = [];
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  }
  uploadButton() {
    this.showUpload = true;
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
  }
}
