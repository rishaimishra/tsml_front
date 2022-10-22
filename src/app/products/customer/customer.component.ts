import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import Swal from 'sweetalert2';
declare var $: any;


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  public product_data: any = '';
  public show_data: boolean = false;
  public qty: Number = 1;
  public selected_size: any = '';
  public delivery_date: any = '';
  public show_error: boolean = false;
  public error_message: String = '';
  user_Id:any;
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
  proPrices: any;
  requoteArr: any = [];
  statusArr: any = [];
  days:any = 30;
  Totalsum:any;
  bptAndfinal:any;
  btpCustomer: any;
  premiumCustomer: any;

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
    this.user_Id = localStorage.getItem('USER_ID');
    this.getState();
    this._route.params.subscribe(res => {
      if (res.id) {
        this.productId = res.id;
      }
    })
    this.detailByRfq();
}

btpPopulat() {
  if (this.btpCustomer != null && this.premiumCustomer != null) {
    console.log('btpCustomer',this.btpCustomer, 'premiumCustomer-', this.premiumCustomer);
    
  }
}
getTotalQuantity(cat_id: any) {
  console.log('cat_id',cat_id);
  for (let i = 0; i < this.selectedItem.length; i++) {
    let form_data_array = this.selectedItem[i]['schedule'];
    let qty = 0;
    for (let i = 0; i < form_data_array.length; i++) {
      qty = qty + parseInt(form_data_array[i]['quantity']);
    }
    this.totalQty = qty;
  }
  $("#qty_"+ cat_id).val(this.totalQty);
  console.log("this.totalQty",this.totalQty);
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
  // let url = '/user/get_quote_sche_by_id/' + this.productId;
  this.productService.getMethod(url).subscribe((res:any) => {
    console.log('resss',res);
    this.spinner.hide();
      if (res.message == 'success') {
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
      if (res.result.length < 1) {
        this._router.navigate(['/rfq-list']);
      }
      else {
        this.product_data = '';
      }

  })
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
      let apiUrl = apiKey+ '/'+ id;
      this.productService.getMethod(apiUrl).subscribe((res: any) => {
        console.log(res)
        if (res.status == 1 && res.result == 'Quote deleted') {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          this.detailByRfq();
        } else {
          this._toaster.error(res.result);
          this.spinner.hide();
        }
      })
    }
  })
}

goToCustomerPage(id: any) {
  this._router.navigate(['/customer',id]);
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

getRequote(event: any) {
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
  const numbersArr = this.requoteArr.map(Number);
  const index: number = numbersArr.indexOf(id);
  if (index !== -1) {
    this.requoteArr.splice(index, 1);
  }
  console.log('requo', this.requoteArr);

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
  console.log('reqParam', this.statusArr);
};

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
    console.log('qty',qty);
    let reqData = {
      rfq_number: this.productId,
      product_id: this.editProductId,
      cat_id: this.selectedItem[i]['cat_id'],
      quantity: qty,
      quote_schedules: form_data_array,
    };
    rfqFormArry.push(reqData);

    if (rfqFormArry[i]['quote_schedules'].quantity == null) {
      this._toaster.error('Quantity can not be empty !');
      this.submit = true;
      this.spinner.hide();
      return;
    }
  }
  console.log('rfqFormArry=',rfqFormArry);
  if (this.requoteArr.length > 0) {
    this._product.reqouteData(this.requoteArr).subscribe((res: any) => {
      if (res.message == 'status updated') {
        this.spinner.hide();
        this._toaster.success(res.result);
      } else {
        this._toaster.error(res.message);
      }
    })
  }
  if (this.statusArr.length > 0) {
    this._product.rfqStatusData(this.statusArr).subscribe((res: any) => {
      if (res.message == 'status updated') {
        this._toaster.success(res.message);
        this.spinner.hide();
      }
      else {
        this._toaster.error(res.message);
      }

    })
  }
  this._product.updateRfq(rfqFormArry).subscribe((res: any) => {
    console.log(res);
    if (res.message == 'success') {
      this.spinner.hide();
      this._toaster.success(res.result);
      // this._router.navigate(['/kam', this.productId]);
    } 
    if (res.message == 'error' || res.status == 0) {
      this._toaster.error(res.message);
      this.spinner.hide();
    }
    if (res.status == 'Token has Expired') {
      this._toaster.error(res.status, 'Please login again');
      this._router.navigate(['/login']);
      this.spinner.hide();
    }
    
  },  err => {
    console.log(err);
    this.spinner.hide();
  });
}

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
  console.log('date',this.nxtDt); 
 
};
selectDay(event:any) {
  console.log(event.target.value);
  this.days = event.target.value;

}
getPrice(location:any, pickup:any) {
  console.log('location-',location, 'pickup-',pickup);
  let price = {
    "user_id": this.user_Id,
    "pickup_from": pickup,
    "location": location
  }
  this._product.priceCalculation(price).subscribe((res:any) => {
      this.proPrices = res.result;
      console.log('this.proPrices',this.proPrices.bpt_price);
      let daysCoast = Number(this.proPrices.credit_cost_for30_days)* Number(this.proPrices.interest_rate)/ Number(100);
    console.log(daysCoast)

      let sum = Number(this.proPrices.bpt_price) + Number(this.proPrices.price_premium) + Number(this.proPrices.misc_expense) + Number(this.proPrices.delivery_cost) 
      + Number(this.proPrices.credit_cost_for30_days) + Number(daysCoast);

      this.Totalsum = sum - Number(this.proPrices.cam_discount);
      this.bptAndfinal = Number(this.Totalsum) - Number(this.proPrices.bpt_price);

  })
}
}
