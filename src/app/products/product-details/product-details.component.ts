import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import * as uuid from 'uuid';
declare var $: any;
import { DatepickerModule } from 'ng2-datepicker';
import { StateCityService } from 'src/app/service/state-city.service';

//import uuid from "uuid";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  public product_data: any = '';
  public show_data: boolean = false;
  public qty: Number = 1;
  public selected_size: any = '';
  public delivery_date: any = '';
  public show_error: boolean = false;
  public error_message: String = '';
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
  userRole:any;
  userType: boolean;
  
  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  userAddr:any;
  plantAddrr:any ;
  showCity:any;
  pickUptype:any;
  locationState:any;
  locationRes:any;
  plantValueArray:any  = [];
  deliveryDropList:any;
  
  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService,
    private _toaster: ToastrService,
    private _state: StateCityService
  ) { }

  ngOnInit(): void {
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      this.userRole = 'K';
      this.userType = false;
    } else {
      this.userRole = 'C';
      this.userType = true;
    }
    this.getDeliveryItem();
    this.states = this._state.getState();
    this._route.params.subscribe((res) => {
      this.productId = res.productId;
      this.categoryid = res.categoryId;
      this.get_product_details(res.productId, res.categoryId);
      this.getLocation();
      this.getSubCategory(this.productId);
    });
    this.setFromData();
  };

  getTotalQuantity(cat_id: any) {
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['form_data'];
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
      }
      this.totalQty = qty;
    }
    $("#qty_" + cat_id).val(this.totalQty);

  };

  get_product_details(product_id: any, category_id: any) {
    this.spinner.show();
    let url = '/product-details/' + product_id + '/' + category_id;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res);
        if (res.status == 1) {
          this.product_data = res.result;
          this.selectedItem.push(this.product_data);
          this.show_data = true;
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
            confirm_date: '',
            sub_cat_id: '',
            salesRemarks: '',
            pickup_type: '',
            kamsRemarks: ''
          });

          console.log('quotation=', this.quotation);
          let i = this.selectedItem.length - 1;
          this.selectedItem[i]['form_data'] = this.quotation;

          console.log('this.selectedItem=', this.selectedItem);
          this.final_form_data();
        } else {
          this.product_data = '';
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  };
  selecte_size(size: any, index: any) {
    this.selected_size = size;
  };

  selectItems(event: any) {
    let categoryId = event.target.value;
    this.categoryid = event.target.value;
    this.spinner.show();
    let url = '/product-details/' + this.productId + '/' + categoryId;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status == 1) {
          this.product_data = res.result;
          this.selectedItem.push(this.product_data);
          console.log('data', this.selectedItem);
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
            confirm_date: '',
            sub_cat_id: '',
            salesRemarks: '',
            pickup_type: '',
            kamsRemarks: ''
          });
          console.log('this.quotation=', this.quotation);
          let quation_lenght = this.quotation.length - 1;
          console.log('quation_lenght=', quation_lenght);

          let i = this.selectedItem.length - 1;
          console.log(
            'this.quotation[quation_lenght]=',
            this.quotation[quation_lenght]
          );
          this.selectedItem[i]['form_data'] = this.quotation;
          console.log('this.selectedItem=', this.selectedItem);
          this.final_form_data();
        } else {
          this.product_data = '';
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  };

  sizeOfferd(event: any) {
    this.proSize1 = event.target.value;
  };

  ReqForQuatation() {
    this.spinner.show();
    this.submit = true;
    const val = Math.floor(1000 + Math.random() * 9000);
    let rfqNumber = val;
    let rfqFormArry: any = [];
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['form_data'];
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
      }
      let reqData = {
        rfq_number: 'RFQ' + rfqNumber,
        product_id: this.productId,
        cat_id: this.selectedItem[i]['cat_id'],
        quantity: qty,
        quote_type: this.userRole,
        quote_schedules: form_data_array,
      };
      rfqFormArry.push(reqData);

      let rfqNumberShow = reqData.rfq_number;
      this._state.sendRfqNumer(rfqNumberShow);
    }
    console.log(rfqFormArry);

    this._product.storeRfq(rfqFormArry).subscribe((res: any) => {
      if (res.status == 1 && res.result != 'Quote not created') {
        this.spinner.hide();
        this._toaster.success('Request success');
        this._router.navigate(['/thank-you']);
        this.spinner.hide();

      } 
      if (res.result == 'Quote not created') {
        this._toaster.error(res.result);
        this.spinner.hide();
      }
      if (res.status == 'Token has Expired' || res.status == 'Authorization Token not found') {
        this._toaster.error('Please register to submit RFQ');
        this._router.navigate(['/login']);
        this.spinner.hide();
      }
    }, err => {
      console.log(err);
      this.spinner.hide();

    });
  };

  addItem(i: any) {
    const scheduleNo = Math.floor(1000 + Math.random() * 9000);
    this.quotation = this.selectedItem[i]['form_data'];
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
      confirm_date: '',
      sub_cat_id: '',
      salesRemarks: '',
      pickup_type: '',
      kamsRemarks: ''
    });
    this.selectedItem[i]['form_data'] = this.quotation;
    // console.log('this.selectedItem=', this.selectedItem);
    this.final_form_data();
  };

  final_form_data() {
    this.quotation_value = [];
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data = this.selectedItem[i]['form_data'];

      for (let k = 0; k < form_data.length; k++) {
        this.quotation_value.push(form_data[k]);
      }
      this.quotation_value[i] = this.selectedItem[i]['form_data'];
    }
  };

  date: any;
  setFromData()
  {
    var today:any = new Date();
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
    var today:any = yyyy + '-' + mm + '-' + dd;
            this.date = today;
    
  };

  nxtDt: any;
  setNxtData(event:any, i:any)
  {
    let day = new Date(event.target.value);
    let nextDay:any = new Date(day);
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
    var nextDt:any = yyyy + '-' + mm + '-' + dd;
            this.nxtDt = nextDt;
            $("#to_date_"+i).attr("min",this.nxtDt);
   
  };

  getLocation () {
    this.spinner.show();
    let userId = localStorage.getItem('USER_ID');
    let apiUrl = '/user/get_user_address/'+userId;

    if(userId != '' || userId != null) {
      this._product.getMethod(apiUrl).subscribe((res:any) => {
        this.spinner.hide();
        this.showCity = res.result.state;
        this.userAddr = res.result.addressone + res.result.addresstwo + res.result.city + res.result.state + res.result.pincode;
        if (res.status == 'Token has Expired') {
          this._router.navigate(['/login']);
          this.spinner.hide();
        }
      })
    }
  };

  plantSele(event:any, i:any) {
    let apiUrl = '/user/get_plant_addr/'+ event.target.value;
    this._product.getMethod(apiUrl).subscribe((res:any) => {
      if (res.status == 1 && res.message == 'success') {
        this.locationState = res.result['state'];

        this.locationRes = res.result['addressone'] + res.result['addresstwo'] + res.result['city'] + res.result['state'] + '' + res.result['pincode']
      }
    })
  };
  
  selectPlant(event:any, schdleNo:any) {
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
          this._router.navigate(['/login']);
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
  subCategory:any;
  getSubCategory(catId:any) {
    console.log(catId);
    this.spinner.show();
    let sizeFilter = {
      cat_id: catId,
    }
    this._product.filterProducts(sizeFilter).subscribe((res: any) => {
      this.spinner.hide();
      if (res.success == true) {
        this.subCategory = res.subCategories;
        console.log('dddd',this.subCategory);
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }
}
