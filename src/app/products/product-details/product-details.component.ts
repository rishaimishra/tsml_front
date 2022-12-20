import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
declare var $: any;
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
  userByrole: any;
  userRole: any;
  userType: boolean;

  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  userAddr: any;
  plantAddrr: any;
  showCity: any;
  pickUptype: any;
  locationState: any = [];
  locationRes: any;
  plantValueArray: any = [];
  deliveryDropList: any;
  prodcutSize: any = [];
  removeCatArr: any = [];
  categori: any = [];
  plantSelectArr: any = [];
  isTermCondition: boolean = false;
  disableItem: boolean = false;

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
    this.userByrole = localStorage.getItem('USER_TYPE');
    if (this.userByrole == 'Kam') {
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
      this.removeCatArr.push(this.categoryid);
      this.removeCatArr.includes(this.categoryid)
      this.getCategoriDetails(this.productId, this.categoryid);
      this.get_product_details(res.productId, res.categoryId);
      this.getLocation();
      this.getSubCategory(this.productId, this.categoryid);

    });
    this.setFromData();
  };

  delectDlvryMethode(event: any, schdl: any, i: any, y: any) {
    let dlvrItem = event.target.value;
    if (dlvrItem == 'Ex-Works') {
      $('#pickupTyp_' + schdl + '_c').hide();
      $('#picLable' + schdl).hide();
    } else {
      $('#pickupTyp_' + schdl + '_c').show();
      $('#picLable' + schdl).show();
    }
    if (dlvrItem == 'DAP (Delivered at Place)') {
      this.disableItem = true;
      $('#pickup_from_' + schdl).prop('disabled', true);
      $('#loca_' + schdl).prop('disabled', true);
      $('#pickupTyp_' + schdl + '_a').prop('disabled', true);
      $('#pickupTyp_' + schdl + '_b').prop('disabled', true);
      $('#pickupTyp_' + schdl + '_c').prop('disabled', true);
      this.selectedItem[i]['form_data'][y].plant = '';
      this.selectedItem[i]['form_data'][y].pickup_type = '';
      this.selectedItem[i]['form_data'][y].location = '';
    } else {
      this.disableItem = false;
      $('#pickup_from_' + schdl).prop('disabled', false);
      $('#loca_' + schdl).prop('disabled', false);
      $('#pickupTyp_' + schdl + '_a').prop('disabled', false);
      $('#pickupTyp_' + schdl + '_b').prop('disabled', false);
      $('#pickupTyp_' + schdl + '_c').prop('disabled', false);
    }
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
  subCatSelect(event: any) {
    this.spinner.show();
    let apiUrl = '/sub_cat_details/' + event.target.value;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1 && res.message == 'success.') {
        this.prodcutSize = res.result['sizes'];
      }
    }, err => {
      console.log(err);
      this.spinner.show();
    })
  };

  get_product_details(product_id: any, category_id: any) {
    this.spinner.show();
    let url = '/product-details/' + product_id + '/' + category_id;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
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

          let i = this.selectedItem.length - 1;
          this.selectedItem[i]['form_data'] = this.quotation;

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
    this.removeCat(categoryId);
    this.removeCatArr.push(categoryId);
    this.categoryid = event.target.value;
    this.spinner.show();
    let url = '/product-details/' + this.productId + '/' + categoryId;
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
            valid_till: '',
            confirm_date: '',
            sub_cat_id: '',
            salesRemarks: '',
            pickup_type: '',
            kamsRemarks: ''
          });

          let i = this.selectedItem.length - 1;
          this.selectedItem[i]['form_data'] = this.quotation;
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

    this.spinner.show();
    this._product.storeRfq(rfqFormArry).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1 && res.result != 'Quote not created') {
        this._toaster.success('Request success');
        this.rfqEmailSent(rfqNumber);
        this._router.navigate(['/products/thank-you']);
        this.spinner.hide();

        let userId = localStorage.getItem('USER_ID');
        let camNotiReq = {
          "desc": 'RFQ has been submitted',
          "desc_no": 'RFQ' + rfqNumber,
          "user_id": userId,
          "url_type": 'R'
        }
        this._product.camNotification(camNotiReq).subscribe((res: any) => {
          console.log(res);
        })

        this.statusBar('RFQ' + rfqNumber)
      }
      if (res.result == 'Quote not created') {
        this._toaster.error(res.result);
        this.spinner.hide();
      }
      if (res.status == 'Token has Expired' || res.status == 'Authorization Token not found') {
        this._toaster.error('Please register to submit RFQ');
        this._router.navigate(['/auth/login']);
        this.spinner.hide();
      }
    }, err => {
      console.log(err);
      this.spinner.hide();

    });
  };
  rfqEmailSent(rfqNumber: any) {
    let userId = localStorage.getItem('USER_ID');
    let rfqEmailReq = {
      "rfq_no": 'RFQ' + rfqNumber,
      "user_id": userId
    }
    this._product.rfqSubmitedEmail(rfqEmailReq).subscribe((res: any) => {

    })
  }
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
    this.final_form_data();
  };
  statusBar(rfqNumber: any) {
    let statusRequest = {
      "rfq_no": rfqNumber,
      "rfq_submited": '1'
    }
    this._product.storeStatusCust(statusRequest).subscribe((res: any) => {
      console.log('status', res);
    })
    this._product.storeStatusKam(statusRequest).subscribe((res: any) => {
      console.log('status', res);
    })
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

  getLocation() {
    this.spinner.show();
    let userId = localStorage.getItem('USER_ID');
    let apiUrl = '/user/get_user_address/' + userId;

    if (userId != '' || userId != null) {
      this._product.getMethod(apiUrl).subscribe((res: any) => {
        this.spinner.hide();
        this.showCity = res.result?.state;
        this.userAddr = res.result?.addressone + res.result?.addresstwo + res.result?.city + res.result?.state + res.result?.pincode;
        if (res.status == 'Token has Expired') {
          this._router.navigate(['/auth/login']);
          this.spinner.hide();
        }
      })
    }
  };

  plantSele(event: any, schdlNo: any) {
    this.plantSelectArr[schdlNo] = event.target.value;
    let indx = this.plantAddrr.find((item: any) => item.name == event.target.value);
    let apiUrl = '/user/get_plant_addr/' + indx.id;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.locationState[schdlNo] = res.result['state'];
        this.locationRes = res.result['addressone'] + res.result['addresstwo'] + res.result['city'] + res.result['state'] + '' + res.result['pincode']

      }
    })
  };

  selectPlant(event: any, schdleNo: any) {
    this.plantSelectArr[schdleNo] = null;
    this.spinner.show();
    let eventValue = event.target.value;
    $('#pickupTyp_' + schdleNo).val(eventValue);
    let apiUrl = '/user/get_plants_by_type/' + eventValue;
    if (eventValue != '') {
      this._product.getMethod(apiUrl).subscribe((res: any) => {
        this.spinner.hide();
        if (res.status == 1 && res.message == 'success') {
          this.plantAddrr = res.result;
        }
        if (res.status == 'Token has Expired' || res.status == 'Authorization Token not found') {
          this._router.navigate(['/auth/login']);
          this.spinner.hide();
        }
      })
    }
  };

  getDeliveryItem() {
    this._product.getDeliveryMethod().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.deliveryDropList = res.result;
      }
    })
  };
  subCategory: any;
  getSubCategory(prodId: any, catId: any) {
    this.spinner.show();
    let sizeFilter = {
      product_id: prodId,
      cat_id: catId
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

  getCategoriDetails(productId: any, catId: any) {
    let categoryFilter = {
      product_id: productId
    }
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

  checkTerms(event: any) {
    this.isTermCondition = event.target.checked;
  };

  removeCat(i: any) {
    let indx = this.categori.findIndex((item: any) => item.id == i);
    if (indx !== -1) {
      this.categori.splice(indx, 1);
    }
  };

  getCatNdProductId(prdId: any, catId: any) {
    this.getSubCategory(prdId, catId);
  }
}
