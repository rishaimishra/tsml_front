import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import * as uuid from 'uuid';
declare var $: any;

@Component({
  selector: 'app-rfq-details',
  templateUrl: './rfq-details.component.html',
  styleUrls: ['./rfq-details.component.scss']
})
export class RfqDetailsComponent implements OnInit {

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
  editProductId :any;
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
      this.productId = res.RFQ;
      this.categoryid = res.categoryId;
      this.detailByRfq();
    });
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
    $("#qty_"+ cat_id).val(this.totalQty);
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

  detailByRfq() {
    this.spinner.show();
    let url = '/user/get_quote_by_id' +'/'+ this.productId;
    this.productService.getMethod(url).subscribe((res:any) => {
      console.log('resss',res);
      this.spinner.hide();
        if (res.status == 1) {
          this.editProductId = res.result[0]['product_id'];
          console.log('this.editProductId=',this.editProductId);
          this.product_data = res.result;
          this.selectedItem.push(this.product_data);
          this.selectedItem = this.product_data;
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

          //let i = this.selectedItem.length - 1;
         // this.selectedItem[i]['form_data'] = this.quotation;
          // this.final_form_data();
        } 
        if (res.status == 'Token has Expired'){
          this._toaster.error(res.status);
          this._router.navigate(['/login']);
        }
        else {
          this.product_data = '';
        }

    })
  }
  deleteRfqById(id: any) {
    this.spinner.show();
    let apiKey = '/user/delete_quote_by_id';
    let apiUrl = apiKey+ '/'+ id;
    this.productService.getMethod(apiUrl).subscribe((res: any) => {
      console.log(res)
      if (res.status == 1 && res.result == 'Quote deleted') {
        this._toaster.success(res.result);
        this.spinner.hide();
        this.detailByRfq();
      } else {
        this._toaster.error(res.result);
        this.spinner.hide();
      }
    })
  }

  goToKamPage(id: any) {
    this._router.navigate(['/kam',id]);
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
    let url = '/product-details/' + this.editProductId + '/' + categoryId;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log('addItem',res);
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
            kam_price: 12505,
            valid_till: '',
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
      console.log(reqData);
      rfqFormArry.push(reqData);
    }
    console.log('rfqFormArry=',rfqFormArry);
    this._product.updateRfq(rfqFormArry).subscribe((res: any) => {
      console.log(res);
      if (res.message == 'success') {
        this.spinner.hide();
        this._toaster.success(res.result);
        this._router.navigate(['/kam', this.productId]);
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
  }

  addItem(i: any) {
    console.log("i",i)
    // const uniqueID = uuid.v4();
    const scheduleNo = Math.floor(1000 + Math.random() * 9000);
    console.log('this.selectedItem=',this.selectedItem);
    this.quotation = this.selectedItem[i]['schedule'];
    console.log('this.quotation=',this.quotation);
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
    this.selectedItem[i]['schedule'] = this.quotation;
    console.log('this.selectedItem=', this.selectedItem);
    this.final_form_data();
  }
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
  }

}
