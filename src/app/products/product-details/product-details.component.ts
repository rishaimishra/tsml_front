import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';


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


  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService
  ) {}

  ngOnInit(): void {
    this.getState();
    this._route.params.subscribe((res) => {
      this.productId = res.productId;
      console.log('id',res);
      this.get_product_details(res.productId, res.categoryId);
    });
  }

  getState () {
    this.states = [
      {
      "key": "AN",
      "name": "Andaman and Nicobar Islands"
      },
      {
      "key": "AP",
      "name": "Andhra Pradesh"
      },
      {
      "key": "AR",
      "name": "Arunachal Pradesh"
      },
      {
      "key": "AS",
      "name": "Assam"
      },
      {
      "key": "BR",
      "name": "Bihar"
      },
      {
      "key": "CG",
      "name": "Chandigarh"
      },
      {
      "key": "CH",
      "name": "Chhattisgarh"
      },
      {
      "key": "DH",
      "name": "Dadra and Nagar Haveli"
      },
      {
      "key": "DD",
      "name": "Daman and Diu"
      },
      {
      "key": "DL",
      "name": "Delhi"
      },
      {
      "key": "GA",
      "name": "Goa"
      },
      {
      "key": "GJ",
      "name": "Gujarat"
      },
      {
      "key": "HR",
      "name": "Haryana"
      },
      {
      "key": "HP",
      "name": "Himachal Pradesh"
      },
      {
      "key": "JK",
      "name": "Jammu and Kashmir"
      },
      {
      "key": "JH",
      "name": "Jharkhand"
      },
      {
      "key": "KA",
      "name": "Karnataka"
      },
      {
      "key": "KL",
      "name": "Kerala"
      },
      {
      "key": "LD",
      "name": "Lakshadweep"
      },
      {
      "key": "MP",
      "name": "Madhya Pradesh"
      },
      {
      "key": "MH",
      "name": "Maharashtra"
      },
      {
      "key": "MN",
      "name": "Manipur"
      },
      {
      "key": "ML",
      "name": "Meghalaya"
      },
      {
      "key": "MZ",
      "name": "Mizoram"
      },
      {
      "key": "NL",
      "name": "Nagaland"
      },
      {
      "key": "OR",
      "name": "Odisha"
      },
      {
      "key": "PY",
      "name": "Puducherry"
      },
      {
      "key": "PB",
      "name": "Punjab"
      },
      {
      "key": "RJ",
      "name": "Rajasthan"
      },
      {
      "key": "SK",
      "name": "Sikkim"
      },
      {
      "key": "TN",
      "name": "Tamil Nadu"
      },
      {
      "key": "TS",
      "name": "Telangana"
      },
      {
      "key": "TR",
      "name": "Tripura"
      },
      {
      "key": "UK",
      "name": "Uttar Pradesh"
      },
      {
      "key": "UP",
      "name": "Uttarakhand"
      },
      {
      "key": "WB",
      "name": "West Bengal"
      }
      ]
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
          console.log('data',this.selectedItem);
          this.show_data = true;
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
  selecte_size(size: any, index: any) {
    this.selected_size = size;
  }
  sizeOffered2(event:any) {
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
    console.log(event.target.value);
    let categoryId = event.target.value;
    console.log('iiidd',this.productId);
    this.spinner.show();
    let url = '/product-details/' + this.productId + '/' + categoryId;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res);
        if (res.status == 1) {
          this.product_data = res.result;
          this.selectedItem.push(this.product_data);
          console.log('data',this.selectedItem);
          this.show_data = true;
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
    console.log(event.target.value);
    this.proSize1 = event.target.value;
  };
  deliveryMethod(event:any) {
    console.log(event.target.value);
  };
  pickupFrom(event: any) {
    console.log(event.target.value);
  };
  deliveryMethod2(event:any) {
    console.log(event.target.value);
  };
  pickupfrome2(event: any) {
    console.log(event.target.value);
  };
  selectlocation2(event:any) {
    console.log(event.target.value);
  }
  billTo2(event: any) {
    console.log(event.target.value);
  }
  shipTo2(event: any) {

  }
  ReqForQuatation() {
    this._router.navigate(['/thank-you']);
    let requestData = {
      rfq_number:'RFQ1237',
      product_id:'3',
      quantity:'1700',
      quote_schedules:[
           {
               schedule_no:'D200',
               quantity: this.quantity1,
               pro_size: this.proSize1,
               to_date: this.deliveryDate2,
               from_date:'2022-09-06',
               expected_price: this.expectedPrice1,
               kam_price: '',
               delivery: this.deliveryDate1,
               valid_till: '',
               plant:'DELI',
               location:'mumbai',
               bill_to:'mumbai',
               ship_to:'mumbai',
               remarks: this.remarks
   
           },
           {
               schedule_no:'D300',
               quantity:'1000',
               pro_size:'10-150',
               to_date:'2022-09-06',
               from_date:'2022-09-06',
               expected_price:'25145',
               kam_price:'12505',
               delivery:'FOR',
               valid_till:'',
               plant:'PLANT',
               location:'mumbai',
               bill_to:'mumbai',
               ship_to:'mumbai',
               remarks:'remarkls'
           },
           {
               schedule_no:'D400',
               quantity:'500',
               pro_size:'10-100',
               to_date:'2022-09-06',
               from_date:'2022-09-06',
               expected_price:'25145',
               kam_price:'12505',
               delivery:'FOR',
               valid_till:'',
               plant:'PLANT',
               location:'mumbai',
               bill_to:'mumbai',
               ship_to:'mumbai',
               remarks:'remarkls'
           }
      ]
   
   }
   console.log(requestData);
  }
}
