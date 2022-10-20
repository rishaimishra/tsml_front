import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import * as uuid from 'uuid';
declare var $: any;
import { DatepickerModule } from 'ng2-datepicker';

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
  
  public quotation: any[] = [];
  public quotation_value: any[] = [];
  totalQty: any;
  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService,
    private _toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.getState();
    this._route.params.subscribe((res) => {
      this.productId = res.productId;
      this.categoryid = res.categoryId;
      console.log('id', res);
      this.get_product_details(res.productId, res.categoryId);
    });
  }

  getTotalQuantity(cat_id: any) {
    console.log(cat_id)
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['form_data'];
      console.log('form_data_array=', form_data_array);
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
      }
      console.log('quantity1', qty);
      this.totalQty = qty;
    }
    $("#qty_" + cat_id).val(this.totalQty);

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
          console.log('data', this.selectedItem);
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
            kam_price: 12505,
            valid_till: '',
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
  }
  selecte_size(size: any, index: any) {
    this.selected_size = size;
  }
  sizeOffered2(event: any) {
    console.log(event.target.value);
  }
  add_to_cart(cat_id: any, product_id: any) {
    console.log('cat_id=', cat_id);
    console.log('product_id=', product_id);
    if (this.selected_size == '') {
      this.show_error = true;
      this.error_message = 'Select the size';
    } else if (this.delivery_date == '') {
      this.show_error = true;
      this.error_message = 'Enter delivery date';
    } else {
      this.show_error = false;
      this.error_message = '';
      console.log('this.selected_size=', this.selected_size);
      console.log('this.delivery_date=', this.delivery_date);
    }
    this._router.navigate(['/my-cart']);
  }

  selectItems(event: any) {
    let categoryId = event.target.value;
    this.categoryid = event.target.value;
    this.spinner.show();
    let url = '/product-details/' + this.productId + '/' + categoryId;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res);
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
            kam_price: 12505,
            valid_till: '',
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
        //console.log('this.product_data=', this.product_data);
      },
      (err) => {
        this.spinner.hide();
        // console.log(err);
      }
    );
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

  // ReqForQuatation1() {
  //   this.submit = true;
  //   this.spinner.show();
  //   console.log(this.quotation_value);
  //   let qty = 0;
  //   for (let i = 0; i < this.quotation_value.length; i++) {
  //     qty = qty + parseInt(this.quotation_value[i]['quantity']);
  //   }
  //   console.log('qty=', qty);
  //   let reqData = {
  //     rfq_number: uuid.v4(),
  //     product_id: this.productId,
  //     cat_id: this.categoryid,
  //     quantity: qty,
  //     quote_schedules: this.quotation_value,
  //   };
  //   console.log(reqData);

  //   this._product.storeRfq(reqData).subscribe((res: any) => {
  //     console.log(res);
  //     if (res.status != 0 && res.result != 'Quote not created') {
  //       this.spinner.hide();
  //       this._toaster.success('Request success');
  //       this._router.navigate(['/thank-you']);
  //     } if (res.result == 'Quote not created') {
  //       this._toaster.error(res.result);
  //       this.spinner.hide();
  //     }

  //   });
  // }
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
        quote_schedules: form_data_array,
      };
      rfqFormArry.push(reqData);
      let qtyNull = reqData['quote_schedules'][i].quantity;
      let remarksNull = reqData['quote_schedules'][i].remarks;
      if (qtyNull == '' || remarksNull == '') {
        this._toaster.error('please check required field');
        this.spinner.hide();
        return;

      }
    }
    this._product.storeRfq(rfqFormArry).subscribe((res: any) => {
      console.log(res);
      if (res.status == 1 && res.result != 'Quote not created') {
        this.spinner.hide();
        this._toaster.success('Request success');
        this._router.navigate(['/thank-you']);
        this.spinner.hide();

      } if (res.result == 'Quote not created') {
        this._toaster.error(res.result);
        this.spinner.hide();
      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status, 'Please login again');
        this._router.navigate(['/login']);
        this.spinner.hide();
      }
    }, err => {
      console.log(err);
      this.spinner.hide();

    });
  }

  addItem(i: any) {
    // const uniqueID = uuid.v4();
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
      kam_price: 12505,
      valid_till: '',
    });
    this.selectedItem[i]['form_data'] = this.quotation;
    // console.log('this.selectedItem=', this.selectedItem);
    this.final_form_data();
  }

  final_form_data() {
    this.quotation_value = [];
    // console.log('this.selectedItem final fn=', this.selectedItem);
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data = this.selectedItem[i]['form_data'];

      for (let k = 0; k < form_data.length; k++) {
        this.quotation_value.push(form_data[k]);
      }
      this.quotation_value[i] = this.selectedItem[i]['form_data'];
    }
    console.log('this.quotation_value=', this.quotation_value);
  }
  
}
