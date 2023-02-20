import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import { DecimalPipe, formatNumber, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StateCityService } from 'src/app/service/state-city.service';
import { SalesService } from 'src/app/service/sales.service';
declare var $: any;
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';


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
  userType: boolean;
  user_Id: any;
  rfqNum: any;
  selectedItem: any = [];
  proSize1: any;
  submit: boolean = false;
  requoteArr: any = [];
  statusArr: any = [];
  days: any = 0;
  negotiationHistory: any;
  showButtons: any;
  totalQty: any;
  editProductId: any;
  messages:any;
  p: number = 1;
  poRedirectArr:any = [];
  userByrole:any;
  qtStatusUpdate:any;
  qoutestId:any;
  deliverySchdule: any = [];
  showCity:any;
  userAddr:any;
  plantAddrr:any;
  deliveryDropList:any;
  subCategory:any;
  isSchduleArr:any = [];
  locationState:any = [];
  locationRes:any;
  plantSelectArr:any = [];
  afterPrePrice:any;
  countReqoutArr:any = [];
  countSche:any;
  rfqUserId:any;
  pickupType:any;
  afterDiscount:any;

  sub_catId :any;
  schedule_no :any;
  tsmlPriceArr: any = [];
  isDap: boolean = false;


  @ViewChild("remarksModel")
  remarksModel!: { show: () => void; hide: () => void; nativeElement: any };

  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router,
    private _product: ProductsService,
    private _toaster: ToastrService,
    private _fb: FormBuilder,
    private _state: StateCityService,
    private location: Location,
    private _sales: SalesService
  ) {$(window).scrollTop(0); }

  getControl(item: AbstractControl): FormControl { return item as FormControl; }
  
  ngOnInit(): void {
    let userRol = localStorage.getItem('USER_TYPE');
    this.userByrole = userRol;
    if(userRol == 'Kam') {
      this.userType = false;
    } else {
      this.userType = true;
    }
    this.getDeliveryItem();
    this.user_Id = localStorage.getItem('USER_ID');
    this._route.params.subscribe(res => {
      if (res.id) {
        this.rfqNum = atob(res.id);
      }
    });

    this.getLocation();
    this.detailByRfq();
    this.getNegotiationHistory();
    this.getSubCategory(this.rfqNum);
    this.getStatusCount();
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
    $("#qty_" + cat_id).val(this.totalQty);
  };

  detailByRfq() {
    this.spinner.show();
    let url = '/user/get_quote_by_id' + '/' + this.rfqNum;
    this.productService.getMethod(url).subscribe((res: any) => {
      this.spinner.hide();
      if (res.message == 'success') {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.product_data = decrypted;
        this.editProductId = decrypted[0]['product_id'];
        this.rfqUserId = this.product_data[0].user_id;
        this.qoutestId = this.product_data[0].quotest;
        this.selectedItem.push(this.product_data);
        this.selectedItem = this.product_data;
        this.show_data = true;
        for (let i = 0; i < this.selectedItem.length; i++) {
          let form_data_array = this.selectedItem[i]['schedule'];
          this.showButtons = form_data_array.length;

          form_data_array.forEach(element => {
            if (element.quote_status == 3) {
              this.isSchduleArr.push(element?.quote_status);
            } 
            else {
              this.isSchduleArr.push(element?.quote_status);
            }

          });
        }
      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status);
        this._router.navigate(['/auth/login']);
      }
      if (res.result.length < 1) {
        this._router.navigate(['/products/rfq-list']);
      }
      else {
        this.product_data = '';
      }
      this.reqouteStatus();
    })
  };

  goToCustomerPage(id: any) {
    this._router.navigate(['/products/customer', id]);
  };
  selecte_size(size: any, index: any) {
    this.selected_size = size;
  };

  sizeOfferd(event: any) {
    this.proSize1 = event.target.value;
  };

  getRequote(event: any) {
    let reqParam = {
      "id": event.target.value,
      "status": 'Req'
    };

    let indxId = this.poRedirectArr.findIndex((item: any) => item.id == event.target.value);
    if (indxId !== -1) {
      this.poRedirectArr.splice(indxId, 1);
    }
    this.poRedirectArr.push(reqParam);

    let indx = this.statusArr.findIndex((item: any) => item.id == event.target.value);
    if (indx !== -1) {
      this.statusArr.splice(indx, 1);
    }

    let checked = event.target.checked;
    if (checked == true) {
      this.requoteArr.push(event.target.value);
    }

    let reqCount = {
      "sche_no": event.target.value,
      "counts": 1
    };

    if (checked == true) {
      this.countReqoutArr.push(reqCount);
    }

  };

  getStatus(id: any, st: number) {
    let indxId = this.poRedirectArr.findIndex((item: any) => item.id == id);
    if (indxId !== -1) {
      this.poRedirectArr.splice(indxId, 1);
    }
    const numbersArr = this.requoteArr.map(Number);
    const index: number = numbersArr.indexOf(id);
    if (index !== -1) {
      this.requoteArr.splice(index, 1);
    }
    // coutArr remove 
    const countArr = this.countReqoutArr.map(Number);
    const i: number = countArr.indexOf(id);
    if (index !== -1) {
      this.countReqoutArr.splice(index, 1);
    }

    if (st === 1) {
      let reqStParam = {
        "id": id,
        "status": 'Acpt'
      };
      this.poRedirectArr.push(reqStParam);
    } else {
      let reqStParam = {
        "id": id,
        "status": 'Rej'
      };
      this.poRedirectArr.push(reqStParam);
    };

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
  };

  selectRadio(event:any) {
    this.qtStatusUpdate = event.target.value;
  };
  
  cancelprice() {
    $("#viewMoreMessage").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  };

  submitRfq() {
    this.submit = true;
    let userRol = localStorage.getItem('USER_TYPE');
    let rediectStatus = [];
    let countArr = [];
    let confrmDate = [];

    let rfqFormArry: any = [];
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['schedule'];
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
        countArr.push(form_data_array[i]['schedule_no']);
        if ((form_data_array[i]['valid_till'] == null || form_data_array[i]['valid_till'] == '') && this.userType == false && this.selectedItem[0]['quotest'] == 5) {
          this.spinner.hide();
          this._toaster.error('','Valid Till is required');
          return;
        }

        let tantetiveReq = {
          "schedule_no": form_data_array[i]['schedule_no'],
          "confirm_date": form_data_array[i]['confirm_date'],
        }
        confrmDate.push(tantetiveReq);
      }
      
      let reqData = {
        rfq_number: this.rfqNum,
        product_id: this.editProductId,
        cat_id: this.selectedItem[i]['cat_id'],
        quantity: qty,
        quote_type: userRol,
        quote_schedules: form_data_array,
      };
      rfqFormArry.push(reqData);
    };

    this.spinner.show();
    //Encrypt
    let password = '123456';
    let encrypted = CryptoJSAesJson.encrypt(rfqFormArry, password);
    this._product.updateRfq(encrypted).subscribe((res: any) => {
      if (res.message == 'success') {
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Updated successully',
          showConfirmButton: false,
          timer: 1500
        })
        // status update and reqoute
        if (this.statusArr.length > 0) {
          this._product.rfqStatusData(this.statusArr).subscribe((res: any) => {
            if (res.message == 'status updated') {
              this.spinner.hide();
            }
            else {
              this._toaster.error(res.message);
            }
          })
          
          let statusRequest = {
            "rfq_no": this.rfqNum,
            "under_negotiation": '1'
          }
          this._product.storeStatusKam(statusRequest).subscribe((res:any) => {
          })
          this._product.storeStatusCust(statusRequest).subscribe((res:any) => {
          })
        }
          // Kam notification send
        else {
          let userId = localStorage.getItem('USER_ID');
          let salesNotiReq = {
            "desc_no": this.rfqNum,
            "user_id": userId,
            "desc": 'RFQ has been updated',
            "url_type": 'R'
          }
          this._product.camNotification(salesNotiReq).subscribe((res:any) => {
          })
          this._product.custNotiSubmit(salesNotiReq).subscribe((res:any) => {
          })
        }
      }
      if (res.message == 'error' || res.status == 0) {
        this._toaster.error(res.message);
        this.spinner.hide();
      }
      if (res.status == 'Token has Expired') {
        this._toaster.error(res.status, 'Please login again');
        this._router.navigate(['/auth/login']);
        this.spinner.hide();
      }

      if (this.requoteArr.length > 0) {
        this._product.reqouteData(this.requoteArr).subscribe((res: any) => {
          if (res.message == 'status updated') {
            this.spinner.hide();
          } else {
            this._toaster.error(res.message);
          }
        })

        let statusRequest = {
          "rfq_no": this.rfqNum,
          "under_negotiation": '1'
        }
        this._product.storeStatusKam(statusRequest).subscribe((res:any) => {
        })
        this._product.storeStatusCust(statusRequest).subscribe((res:any) => {
        })
      }

      if (this.countReqoutArr.length > 0) {
        this._product.reqouteCount(this.countReqoutArr).subscribe((res:any) => {
        })
      }

    }, err => {
      console.log(err);
      this.spinner.hide();
    });

    let addCount = Number(this.statusArr.length + this.countSche['aac_rej']);
    if (this.countSche['total'] == addCount) {
      let userId = localStorage.getItem('USER_ID');
      let confimerRfq = {
        "rfq_no": this.rfqNum,
        "user_id": this.rfqUserId,
        "kam_id": userId
      }
      this._product.confirmRfqEmail(confimerRfq).subscribe((res:any) => {
      })
    } 

    if ((rediectStatus.includes('Rej') == false &&  rediectStatus.includes('Req') == false) && rediectStatus.length == countArr.length) {
      this._router.navigate(['/po/po',this.rfqNum]);
    } else {
      this._router.navigate(['/products/rfq-list']);
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

  getNegotiationHistory() {
    let apiUrl = '/user/quotes_history/' + this.rfqNum;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      this.negotiationHistory = res.result;
    })
  };

  messageBox(shcdlNo:any) {
    this.spinner.show();
    // let apiUrl = '/user/view_remarks/' + shcdlNo;
    let userType = localStorage.getItem('USER_TYPE');
    let reqParams = {
      "rfq": this.rfqNum,
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

  clickBack() {
    this.location.back();
  };

  getLocation () {
    this.spinner.show();
    let userId = localStorage.getItem('USER_ID');
    let apiUrl = '/user/get_user_address/'+userId;

    if(userId != '' || userId != null) {
      this._product.getMethod(apiUrl).subscribe((res:any) => {
        this.spinner.hide();
        this.showCity = res.result.city;
        this.userAddr = res.result.addressone + res.result.addresstwo + res.result.city + res.result.state + res.result.pincode;
        if (res.status == 'Token has Expired') {
          this._router.navigate(['/auth/login']);
          this.spinner.hide();
        }
      })
    }
  };
  plantSele(event:any, schdlNo:any) {
    this.spinner.show();
    this.plantSelectArr[schdlNo] = event.target.value;

    let indx = this.plantAddrr.find((item: any) => item.name == event.target.value);
    let apiUrl = '/user/get_plant_addr/'+ indx.id;
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

  getDeliveryItem () {
    this._product.getDeliveryMethod().subscribe((res:any) => {
      if (res.status == 1 && res.message == 'success') {
        this.deliveryDropList = res.result;
      } 
    })
  };
  reqouteStatus() {
    let apiUrl = '/user/get_count_requote/'+ this.rfqNum;
    this._product.getMethod(apiUrl).subscribe((res:any) => {
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
  
  getStatusCount() {
    let apiUrl = '/user/get_count_sche/'+this.rfqNum;
    this._product.getMethod(apiUrl).subscribe((res:any) => {
      if (res.status == 1 && res.message == 'success') {
        this.countSche = res.result;
      }
    })
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
      $('#pickup_from_' + schdl).prop('disabled', true);
      $('#loca_' + schdl).prop('disabled', true);
      $('#pickupTyp_' + schdl + '_a').prop('disabled', true);
      $('#pickupTyp_' + schdl + '_b').prop('disabled', true);
      $('#pickupTyp_' + schdl + '_c').prop('disabled', true);
      this.selectedItem[i]['form_data'][y].plant = '';
      this.selectedItem[i]['form_data'][y].pickup_type = '';
      this.selectedItem[i]['form_data'][y].location = '';
    } else {
      $('#pickup_from_' + schdl).prop('disabled', false);
      $('#loca_' + schdl).prop('disabled', false);
      $('#pickupTyp_' + schdl + '_a').prop('disabled', false);
      $('#pickupTyp_' + schdl + '_b').prop('disabled', false);
      $('#pickupTyp_' + schdl + '_c').prop('disabled', false);
    }
  };
}
