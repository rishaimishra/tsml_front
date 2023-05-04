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
  selector: 'app-kam',
  templateUrl: './kam.component.html',
  styleUrls: ['./kam.component.scss']
})
export class KamComponent implements OnInit {
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
  submit: boolean = false;
  requoteArr: any = [];
  statusArr: any = [];
  days: any = 0;
  Totalsum: any;
  bptAndfinal: any;
  priceForm: FormGroup;
  finalResult: any = 0;
  Totalsum1: any;
  bptAndfinal1: any;
  productPrice: any;
  schldId: any;
  firstIndex: any;
  lastIndex: any;
  negotiationHistory: any;
  priceVal: any;
  priceLimit: any = [];
  showButtons: any;
  kamsRemarks: any = '';

  totalQty: any;
  editProductId: any;
  submitted: boolean = false;
  premiumPrice: boolean = false;
  deliveryCost: boolean = false;
  credCost: boolean = false;
  daysCostCount: any;
  daysCostCountCustomer: any;
  messages: any;
  p: number = 1;
  poRedirectArr: any = [];
  percentPrice: any;
  remarksData: any = '';
  deleteId: any;
  userByrole: any;
  qtStatusUpdate: any;
  qoutestId: any;

  myForm: FormGroup;
  arr: FormArray;
  showModalIsValue: boolean = false;
  schduleNo: any;
  totlQty: any;
  resData: any;
  deliverySchdule: any = [];
  billto: any = [];
  shipto: any = [];
  userAddr: any;
  plantAddrr: any;
  deliveryDropList: any;
  subCategory: any;
  submitt: boolean = false;
  isSchduleArr: any = [];
  locationState: any = [];
  locationRes: any;
  plantSelectArr: any = [];
  afterPrePrice: any;
  userAfterPrePrice: any;
  countReqoutArr: any = [];
  countSche: any;
  rfqUserId: any;
  pickupType: any;
  afterDiscount: any;

  public quotation: any[] = [];
  public quotation_value: any[] = [];

  sub_catId: any;
  sizes: any;
  schedule_no: any;
  plant_location: any;
  compPrice: any;
  tsmlPriceArr: any = [];
  plusMinus: any;
  daysVal: any;
  getDays: any;
  daysCal: any;
  totalValue: any;
  isDap: boolean = false;
  creditDays: any = [];
  catId: any;
  prodcutSize: any;
  slsHeadMsg: any;
  lastQoute: any = [];
  remarksArry: any = [];
  deliveryMethodVal: any;
  pickupVal: any;



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
  ) { $(window).scrollTop(0); }

  get ff() { return this.myForm.controls; }
  get t() { return this.f.arr as FormArray; }

  getControl(item: AbstractControl): FormControl { return item as FormControl; }

  ngOnInit(): void {
    let userRol = localStorage.getItem('USER_TYPE');
    this.userByrole = userRol;
    if (userRol == 'Kam') {
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

    this.detailByRfq();
    this.setFromData();
    this.getNegotiationHistory();
    this.priceForm = this._fb.group({
      price_premium: ['', Validators.required],
      misc_expense: [''],
      delivery_cost: [''],
      creditCoast: [''],
      interest_rate: [''],
      cam_discount: [''],
      totalSum: [''],
      finalAmt: [''],
    })

    this.pricaValue();
    this.getCompPrice();
    this.myForm = this._fb.group({
      arr: this._fb.array([])
    })
    this.getStatusCount();
  }

  createItem(qty: any, to_date: any) {
    return this._fb.group({
      quantity: [qty, Validators.required],
      to_date: [to_date, Validators.required]
    })
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
    let url = '/user/get_quote_by_id' + '/' + this.rfqNum;
    this.productService.getMethod(url).subscribe((res: any) => {
      this.spinner.hide();
      if (res.message == 'success') {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        console.log(decrypted);
        this.catId = decrypted[0]['cat_id'];
        this.editProductId = decrypted[0]['product_id'];
        this.product_data = decrypted;
        this.rfqUserId = this.product_data[0].user_id;
        // this.getLocation(this.rfqUserId);
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
          pay_term: 'Advance Payment',
          remarks: '',
          kam_price: '',
          credit_days: '',
          valid_till: null,
          confirm_date: '',
          sub_cat_id: '',
          salesRemarks: '',
          pickup_type: '',
          kamsRemarks: '',
          kamsRemarkssp: '',
          kamsRemarkssh: ''
        });
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
    this.getSalesHed(this.rfqNum);
  };

  deleteRfqById(qoute_id: any, id: any) {
    this.deleteId = qoute_id;

  };

  submitRemarks() {
    let useriD = localStorage.getItem('USER_ID');
    if (this.remarksData != '') {
      let remarksReq = {
        "quote_id": this.deleteId,
        "kam_id": useriD,
        "remarks": this.remarksData
      }
      this._product.remarksDelet(remarksReq).subscribe((res: any) => {
        Swal.fire(
          'Canceled!',
          'Your Item has been Canceled.',
          'success'
        )
        this.remarksData = '';
        this.detailByRfq();

      })
    } else {
      this._toaster.error('', 'Remarks is required!');
    }
  };

  goToCustomerPage(id: any) {
    this._router.navigate(['/products/customer', id]);
  };
  
  selecte_size(size: any, index: any) {
    this.selected_size = size;
  };

  // sizeOfferd(event: any) {
  //   this.proSize1 = event.target.value;
  // };

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

  pricaValue() {
    this._product.getPiceValue().subscribe((res: any) => {
      this.priceVal = res.result;
    });
  };

  selectRadio(event: any) {
    this.qtStatusUpdate = event.target.value;
  };

  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem('', ''));
  };

  removeItem() {
    const remove: any = this.arr;
    remove.removeAt(-1);
  };

  schduleSele(schdlNo: any, qty: any) {
    this.myForm.reset();
    this.schduleNo = schdlNo;
    let apiUrl = '/user/get_quotedel_by_id/' + this.schduleNo;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      this.showModalIsValue = true;
      this.myForm = this._fb.group({
        arr: this._fb.array([])
      })
      this.resData = res.result;
      this.arr = this.myForm.get('arr') as FormArray;
      for (let i of res.result) {
        this.arr.push(this.createItem(i.qty, i.to_date));
      }
    });
    this.totlQty = qty;
    // this.myForm.reset();
  };

  onQtySubmit(totlQty: any) {
    this.submitt = true;
    for (let index = 0; index < this.myForm.value.arr.length; index++) {
      const element = this.myForm.value.arr[index];
      if (element['quantity'] == "" || element['to_date'] == "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Quantity and Tentative date are required!',
      })
      return;
    }
    }

    let schdlData = this.myForm.value['arr'];
    let setSechdule = {
      "sche_no": this.schduleNo,
      "schedules": schdlData
    }

    let qty = 0;
    for (let i = 0; i < schdlData.length; i++) {
      qty = qty + parseInt(schdlData[i]['quantity']);
    }

    if (qty != totlQty && qty > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Total quantity should be equal to RFQ quantity!',
      })
      return;

    } else {
      let indx = this.deliverySchdule.findIndex((item: any) => item.sche_no == this.schduleNo);
      if (indx !== -1) {
        this.deliverySchdule.splice(indx, 1);
      }
      this.deliverySchdule.push(setSechdule);
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: 'Added!',
        showConfirmButton: false,
        timer: 1500
      })
      this.myForm.reset();
    }
    $("#createSechdule").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  };

  submitRfq() {
    // console.log(this.requoteArr);
    // return;
    this.submit = true;
    let userRol = localStorage.getItem('USER_TYPE');
    let countArr = [];
    let confrmDate = [];
    let rediectStatus = [];
    let rfqFormArry: any = [];
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data_array = this.selectedItem[i]['schedule'];
      let qty = 0;
      for (let i = 0; i < form_data_array.length; i++) {
        qty = qty + parseInt(form_data_array[i]['quantity']);
        countArr.push(form_data_array[i]['schedule_no']);
        if ((form_data_array[i]['valid_till'] == null || form_data_array[i]['valid_till'] == '') && this.userType == false && this.selectedItem[0]['quotest'] == 5) {
          this.spinner.hide();
          this._toaster.error('', 'Valid Till is required');
          return;
        }

        if (form_data_array[i].delivery == "" || form_data_array[i].sub_cat_id == ""
          || form_data_array[i].pro_size == "" || form_data_array[i].quantity == "" || form_data_array[i].pickup_type == "" || form_data_array[i].from_date == ""
          || form_data_array[i].to_date == "" || form_data_array[i].plant == "" || form_data_array[i].location == null) {
          return;
        }

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
        // let qouteCheck = this.selectedItem[i]['schedule'][i]?.sche_ct;
        // this.lastQoute.push(qouteCheck);
        // console.log(qouteCheck);
        let qouteSts = this.selectedItem[0]['quotest'];

        if (qouteSts == 0) {
          let rmarksParam = {
            rfq_no: this.rfqNum,
            sche_no: form_data_array[i].schedule_no,
            remarks: '',
            camremarks: form_data_array[i].kamsRemarks,
            salesremarks: '',
            from: 'Kam',
            to: 'Sales'
          };
          this.remarksArry.push(rmarksParam);
        }
        else if (qouteSts == 5) {
          let rmarksParam = {
            rfq_no: this.rfqNum,
            sche_no: form_data_array[i].schedule_no,
            remarks: '',
            camremarks: form_data_array[i].kamsRemarks,
            salesremarks: '',
            from: 'Kam',
            to: 'SM'
          };
          this.remarksArry.push(rmarksParam);
        }
        else if (qouteSts == 2) {
          let rmarksParam = {
            rfq_no: this.rfqNum,
            sche_no: form_data_array[i].schedule_no,
            remarks: '',
            camremarks: form_data_array[i].kamsRemarks,
            salesremarks: '',
            from: 'Kam',
            to: 'Sales'
          };
          this.remarksArry.push(rmarksParam);
        }
        else if (qouteSts == 6) {

          if(this.requoteArr.length > 0)
          {
            var rmarksParam = {
              rfq_no: this.rfqNum,
              sche_no: form_data_array[i].schedule_no,
              remarks: '',
              camremarks: form_data_array[i].kamsRemarks,
              salesremarks: '',
              from: 'Kam',
              to: 'SM'
            };
          }
          else{
            var rmarksParam = {
            rfq_no: this.rfqNum,
            sche_no: form_data_array[i].schedule_no,
            remarks: '',
            camremarks: form_data_array[i].kamsRemarks,
            salesremarks: '',
            from: 'Kam',
            to: 'C'
          };
        }
          this.remarksArry.push(rmarksParam);
        }
        else if (qouteSts == 9) {
          let rmarksParam = {
            rfq_no: this.rfqNum,
            sche_no: form_data_array[i].schedule_no,
            remarks: '',
            camremarks: form_data_array[i].kamsRemarks,
            salesremarks: '',
            from: 'Kam',
            to: 'SM'
          };
          this.remarksArry.push(rmarksParam);
        }
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
      this.poRedirectArr.forEach((element:any) => {
        rediectStatus.push(element.status);
      });
    };

    let userId = localStorage.getItem('USER_ID');
    let custNotiReq = {
      "desc_no": this.rfqNum,
      "user_id": userId,
      "desc": 'Subcategory has been accepted against',
      "url_type": 'R',
      "sender_id": this.rfqUserId
    }

    let qouteSt = this.selectedItem[0]['quotest'];
    this.spinner.show();
    //Encrypt
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(rfqFormArry, passwordd);
    this._product.updateRfq(encryptedd).subscribe((res: any) => {
      this.spinner.hide();
      if (res.message == 'success') {
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
          this._product.storeStatusKam(statusRequest).subscribe((res: any) => {
          })
          this._product.storeStatusCust(statusRequest).subscribe((res: any) => {
          })
        }
        let userId = localStorage.getItem('USER_ID');
        let salesNotiReq = {
          "desc_no": this.rfqNum,
          "user_id": userId,
          "desc": 'RFQ has been updated',
          "url_type": 'R',
          "sender_id": this.rfqUserId
        }
        this._product.custNotiSubmit(salesNotiReq).subscribe((res: any) => {
        })

        // if(this.lastQoute.includes(2)) {
        //   let items = {
        //     rfq_no: this.rfqNum,
        //     user_id: this.rfqUserId
        //   }
        //   this._product.submitFinalQouteMail(items).subscribe((res:any) => {
        //     console.log(res)
        //   })
        // }
        if ((rediectStatus.includes('Rej') == false && rediectStatus.includes('Req') == false) && rediectStatus.length == countArr.length) {
          this._product.custNotiSubmit(custNotiReq).subscribe();
        }
        this.camRemarks();
        this.otherFuncApi(qouteSt);
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

    }, err => {
      console.log(err);
      this.spinner.hide();
    });

  };

  otherFuncApi(qouteSt:any) {
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
      this._product.storeStatusKam(statusRequest).subscribe();
      this._product.storeStatusCust(statusRequest).subscribe();
    }

    if (this.countReqoutArr.length > 0) {
      this._product.reqouteCount(this.countReqoutArr).subscribe();
    }

    if (qouteSt != 5 && qouteSt != 6 || qouteSt == 2) {
      this._product.dlvrySchdule(this.deliverySchdule).subscribe((res: any) => {
      })

      if (qouteSt != 9) {
        let qouteReq = {
          "rfq_no": this.rfqNum,
          "status": 7
        }
        this._product.qouteStatusUpdate(qouteReq).subscribe((res: any) => {
        })
      }
      // Sales notification send
      let userId = localStorage.getItem('USER_ID');
      let salesNotiReq = {
        "desc_no": this.rfqNum,
        "user_id": userId,
        "desc": 'Tentative date and quantity updated',
        "url_type": 'R'
      }
      this._product.salesNoti(salesNotiReq).subscribe((res: any) => {
      })

      let statusRequest = {
        "rfq_no": this.rfqNum,
        "approve_pending_from_sales": '1'
      }
      this._product.storeStatusKam(statusRequest).subscribe((res: any) => {
      })

    }

    // component price save here
    this._product.saveComPrice(this.tsmlPriceArr).subscribe();


    // let addCount = Number(this.statusArr.length + this.countSche['aac_rej']);
    // if (this.countSche['total'] == addCount) {
    //   let userId = localStorage.getItem('USER_ID');
    //   let confimerRfq = {
    //     "rfq_no": this.rfqNum,
    //     "user_id": this.rfqUserId,
    //     "kam_id": userId

    //   }
    //   this._product.confirmRfqEmail(confimerRfq).subscribe((res: any) => {
    //   })
    // }

    if (qouteSt == 5 || qouteSt == 9) {
      let qouteReq = {
        "rfq_no": this.rfqNum,
        "status": 8
      }
      this._product.qouteStatusUpdate(qouteReq).subscribe();

      

      let statusRequest = {
        "rfq_no": this.rfqNum,
        "price_approved_awaited": '1'
      }

      this._product.storeStatusKam(statusRequest).subscribe();

      let salesHdNoti = {
        "desc": "Price added against this ",
        "desc_no": this.rfqNum,
        "sender_ids": this.rfqUserId
      }
      this._sales.salesHeadNoti(salesHdNoti).subscribe();
    }

    // ----------- cam requote price update

    if (qouteSt == 6 && this.requoteArr.length > 0) {
      let qouteReq = {
        "rfq_no": this.rfqNum,
        "status": 8
      }
      this._product.qouteStatusUpdate(qouteReq).subscribe();
      }
      // --------------------------------------------------------

    let apiUrlKy = '/user/get_rfq_st/'+this.rfqNum
    this._product.getMethod(apiUrlKy).subscribe((res:any) => {
      if(res.result == "Accepted") {
        let userId = localStorage.getItem('USER_ID');
          let confimerRfq = {
            "rfq_no": this.rfqNum,
            "user_id": this.rfqUserId,
            "kam_id": userId
    
          }
          this._product.confirmRfqEmail(confimerRfq).subscribe((res: any) => {
          })
      }
    }, err => {
      console.log(err);
    })
    
    this._router.navigate(['/products/rfq-list']);
  };

  camRemarks() {
    this._product.submitRfqRemarks(this.remarksArry).subscribe((res:any) => {
      console.log(res);
    })
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

    var today: any = yyyy + '-' + mm + '-' + dd;
    this.date = today;
    var todayValid = new Date().toISOString().slice(0, 16)
    $("#valid_date").attr("min", todayValid);
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

    var nextDt: any = yyyy + '-' + mm + '-' + dd;
    this.nxtDt = nextDt;
    $("#to_date_" + i).attr("min", this.nxtDt);

  };

  getPrice(location: any, pickup: any, schedule_no: any, shipTo: any, prodId: any, catid: any, size: any, subCatId: any, plant: any, dlvr: any, dap: any, i: any, y: any) {
    console.log('DEL VAL',schedule_no);
    console.log(dlvr);
    this.deliveryMethodVal = dlvr;
    this.pickupVal = pickup;
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
      "delivery_method": dap,
      "sub_cat_id": subCatId
    }
    console.log(price);
    //Encrypt
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(price, passwordd);

    this._product.priceCalculation(encryptedd).subscribe((res: any) => {
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
      // Decrypt
      let password = '123456'
      let decrypted = CryptoJSAesJson.decrypt(res.result, password);

      this.productPrice = decrypted;
      const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.delivery_cost);

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
        this.getDays = this.afterPrePrice;
      }
      else if (this.days == 30) {
        let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
        this.getDays = finalCost.toFixed(2);
      }
      else if (this.days == 45) {
        let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
        this.getDays = finalCost.toFixed(2);
      }

      let totl = Number(this.getDays) + Number(this.productPrice.misc_expense);

      if (this.plusMinus == '-') {
        this.Totalsum = totl - Number(this.productPrice.cam_discount);
      }
      else {
        this.Totalsum = totl + Number(this.productPrice.cam_discount);
      }
    })

    let managerReq = {
      "rfq_no": this.rfqNum,
      "sche_no": schedule_no
    }
    //Encrypt
    let password = '123456';
    let encrypted = CryptoJSAesJson.encrypt(managerReq, password);

    this._sales.submitManagerRfq(encrypted).subscribe((res: any) => {
      // Decrypt
      let password = '123456'
      let decrypted = CryptoJSAesJson.decrypt(res.result, password);

      if (res.status == 1 && decrypted.length > 0) {
        this.priceForm.controls['price_premium'].setValue(decrypted[1].value);
        this.priceForm.controls['cam_discount'].setValue(decrypted[6].value);
        this.priceForm.controls['delivery_cost'].setValue(decrypted[2].value);
        this.priceForm.controls['interest_rate'].setValue(decrypted[3].value);
        this.priceForm.controls['creditCoast'].setValue(decrypted[4].value);
        this.priceForm.controls['misc_expense'].setValue(decrypted[5].value);
        this.priceForm.controls['totalSum'].setValue(decrypted[7].value);
        this.priceForm.controls['finalAmt'].setValue(decrypted[8].value);
      }
    })
  };

  selectPlusMins(event: any) {
    this.plusMinus = event.target.value;
  };

  selectDay(event: any, priceSign: any) {
    this.days = event.target.value;
    const backendTotal = Number(this.productPrice.bpt_price) + Number(this.productPrice.delivery_cost);
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
      this.daysVal = this.afterPrePrice;
    }
    else if (this.days == 30) {
      let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
      this.daysVal = finalCost.toFixed(2);
    }
    else if (this.days == 45) {
      let finalCost = (Number(this.afterPrePrice) + Number(this.daysCostCount));
      this.daysVal = finalCost.toFixed(2);
    }

    let misc = Number(this.daysVal) + Number(this.productPrice.misc_expense);

    if (this.plusMinus == '-') {
      this.Totalsum = misc - Number(this.productPrice.cam_discount);
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
    // let totalPercent = ((this.totalValue - this.Totalsum) / this.Totalsum )* 100;
    // this.percentPrice = totalPercent.toFixed(2);


    if (this.days == 0) {
      this.daysCal = this.userAfterPrePrice;
    }
    else if (this.days == 30) {
      let finalCost = (Number(this.userAfterPrePrice) + Number(this.daysCostCountCustomer));
      this.daysCal = finalCost.toFixed(2);
    }
    else if (this.days == 45) {
      let finalCost = (Number(this.userAfterPrePrice) + Number(this.daysCostCountCustomer));
      this.daysCal = finalCost.toFixed(2);
    }

    let misc = Number(this.daysCal) + Number(misc_expense);

    if (this.plusMinus == '-') {
      this.totalValue = misc - Number(_discount);
    }
    else if (this.plusMinus == '+') {
      this.totalValue = misc + Number(_discount);
    }
    else {
      this.totalValue = misc + Number(_discount);
    }
    let totalPercent = ((this.totalValue - this.Totalsum) / this.Totalsum) * 100;
    this.percentPrice = totalPercent.toFixed(2);
  };

  getNegotiationHistory() {
    let apiUrl = '/user/quotes_history/' + this.rfqNum;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      this.negotiationHistory = res.result;
    })
  };

  priceSave(id: any, firstIndx: any, lastIndx: any) {
    // if (!this.priceForm.valid) {
    //   this.submitted = true;
    //   return;
    // };

    this.selectedItem[firstIndx].schedule[lastIndx].kam_price = this.totalValue;
    let plantReqst = {
      "data": this.pickupType
    }
    this._product.getIdbyPlant(plantReqst).subscribe((res: any) => {
      let plantId = res.result

      if (res.status == 1 && res.message == 'success') {
        let bptPrice = $('#_bptPrice' + id).val();
        let pricPrem = $('#price_premium' + id).val();
        let discount = $('#_discount' + id).val();
        let delivery = $('#delivery' + id).val();
        let interest = $('#_interest' + id).val();
        let credit = $('#_credit' + id).val();
        let miscEx = $('#misc_expense' + id).val();
        let _discount = $('#_discount' + id).val();
        let total = $('#_total' + id).val();
        let diffPrice = $('#_bptAndfinal' + id).val();

        let componentArr = [
          {
            "comp": this.compPrice[0].code,
            "value": bptPrice
          },
          {
            "comp": this.compPrice[1].code,
            "value": pricPrem
          },
          {
            "comp": this.compPrice[2].code,
            "value": delivery
          },
          {
            "comp": this.compPrice[3].code,
            "value": interest
          },
          {
            "comp": this.compPrice[4].code,
            "value": credit
          },
          {
            "comp": this.compPrice[5].code,
            "value": miscEx
          },
          {
            "comp": this.compPrice[6].code,
            "value": _discount
          },
          {
            "comp": this.compPrice[7].code,
            "value": total
          },
          {
            "comp": this.compPrice[8].code,
            "value": diffPrice
          }
        ]
        let compPriceArr = {
          "sub_cat_id": this.sub_catId,
          "size": this.sizes,
          "plant": plantId,
          "rfq_no": this.rfqNum,
          "schedule": this.schedule_no,
          "components": componentArr
        }
        this.tsmlPriceArr.push(compPriceArr);
      }

    })
    $("#camsPrice" + id).val(this.Totalsum1);
    let daysCrd = $('#credDays' + id).val();
    let daysAr = {
      "id": id,
      "days": daysCrd
    }
    let indxId = this.creditDays.findIndex((item: any) => item.id == id);
    if (indxId !== -1) {
      this.creditDays.splice(indxId, 1);
    }
    this.creditDays.push(daysAr);
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
    $(".kamClass").keypress();
  };

  messageBox(shcdlNo: any) {
    this.spinner.show();
    // let apiUrl = '/user/view_remarks/' + shcdlNo;
    let userType = localStorage.getItem('USER_TYPE');
    let reqParams = {
      "rfq": this.rfqNum,
      "sche_no": shcdlNo,
      "user_type": userType
    }

    this._product.remarksList(reqParams).subscribe((res: any) => {
      if (res.message == 'success') {
        this.spinner.hide();
        this.messages = res.result;
      }
    })
  };

  cancelprice() {
    $("#viewMoreMessage").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");

  };

  cancelprice2() {
    $("#addPrice").hide();
    $('body').removeClass('modal-open');
    $(".modal-backdrop").removeClass("modal-backdrop show");
  };

  clickBack() {
    this.location.back();
  };

  // getLocation(userId: any) {
  //   this.spinner.show();
  //   let apiUrl = '/user/get_user_address/' + userId;

  //   if (userId != '' || userId != null) {
  //     this._product.getMethod(apiUrl).subscribe((res: any) => {
  //       this.spinner.hide();
  //       this.billto = res.result['bill'];
  //       this.shipto = res.result['ship'];
  //       this.userAddr = res.result.addressone + res.result.addresstwo + res.result.city + res.result.state + res.result.pincode;
  //       if (res.status == 'Token has Expired') {
  //         this._router.navigate(['/auth/login']);
  //         this.spinner.hide();
  //       }
  //     })
  //   }
  // };

  plantSele(event: any, schdlNo: any) {
    this.spinner.show();
    this.plantSelectArr[schdlNo] = event.target.value;
    let indx = this.plantAddrr.find((item: any) => item.name == event.target.value);
    let apiUrl = '/user/get_plant_addr/' + indx.id;
    this.getSubCategory(this.editProductId, this.catId, indx.id);
    this._product.getMethod(apiUrl).subscribe((res: any) => {
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

  selectPlant(event: any, schdleNo: any) {
    this.plantSelectArr[schdleNo] = null;
    this.spinner.show();
    this.pickupVal = event.target.value;
    let eventValue = event.target.value;
    $('#pickupTyp_' + schdleNo).val(eventValue);
    let apiUrl = '/user/get_plants_by_type/' + eventValue;
    if (eventValue != '') {
      this._product.getMethod(apiUrl).subscribe((res: any) => {
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

  getDeliveryItem() {
    this._product.getDeliveryMethod().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.deliveryDropList = res.result;
      }
    })
  };
  reqouteStatus() {
    let apiUrl = '/user/get_count_requote/' + this.rfqNum;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
    })
  };

  // getSubCategory(catId:any) {
  //   this.spinner.show();
  //   let sizeFilter = {
  //     cat_id: catId,
  //   }
  //   this._product.filterProducts(sizeFilter).subscribe((res: any) => {
  //     this.spinner.hide();
  //     if (res.success == true) {
  //       this.subCategory = res.subCategories;
  //     }
  //   }, err => {
  //     console.log(err);
  //     this.spinner.hide();
  //   })
  // };

  getSubCategory(prodId: any, catId: any, plantId: any) {
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
      }
    }, err => {
      console.log(err);
      this.spinner.show();
    })
  };

  getStatusCount() {
    let apiUrl = '/user/get_count_sche/' + this.rfqNum;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.countSche = res.result;
      }
    })
  };

  getCompPrice() {
    this._product.getPriceComp().subscribe((res: any) => {
      this.compPrice = res.result;
    })
  }

  delectDlvryMethode(event: any, schdl: any, i: any, y: any) {
    let dlvrItem = event.target.value;
    this.deliveryMethodVal = event.target.value;
    //this.deliveryMethodVal = event.target.value;
    if (dlvrItem == 'Ex-Works') {
      $('#pickupTyp_' + schdl + '_c').hide();
      $('#picLable' + schdl).hide();
      $('#contact' + schdl+'_c').hide();
    } else {
      $('#pickupTyp_' + schdl + '_c').show();
      $('#picLable' + schdl).show();
      $('#contact' + schdl+'_c').show();
    }
    if (dlvrItem == 'DAP (Delivered at Place)') {
      // $('#pickup_from_' + schdl).prop('disabled', true);
      // $('#loca_' + schdl).prop('disabled', true);
      // $('#pickupTyp_' + schdl + '_a').prop('disabled', true);
      // $('#pickupTyp_' + schdl + '_b').prop('disabled', true);
      // $('#pickupTyp_' + schdl + '_c').prop('disabled', true);
      this.selectedItem[i]['form_data'][y].plant = '';
      this.selectedItem[i]['form_data'][y].pickup_type = '';
      this.selectedItem[i]['form_data'][y].location = '';
    } else {
      // $('#pickup_from_' + schdl).prop('disabled', false);
      // $('#loca_' + schdl).prop('disabled', false);
      // $('#pickupTyp_' + schdl + '_a').prop('disabled', false);
      // $('#pickupTyp_' + schdl + '_b').prop('disabled', false);
      // $('#pickupTyp_' + schdl + '_c').prop('disabled', false);
    }
  };

  getSalesHed(rfqNum: any) {
    let apiUrl = '/user/sm_remark_by_id/' + rfqNum;
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      if (res.status == 1) {
        this.slsHeadMsg = res.result;
      }
    })
  };

  addSechudle(i:any, schdlNo:any) {
    const scheduleNo = Math.floor(1000 + Math.random() * 9000);
    this.quotation = this.selectedItem[i]['schedule'];

    let shipId = $('#shipToVal_'+schdlNo).val();
    let billtoId = $('#billToId'+schdlNo).val();
    let expPrice = $('#expectedPr_'+schdlNo).val();
    let billState = $('#billtoState'+schdlNo).html();
    let shipState = $('#shipState'+schdlNo).html();

    this.quotation.push({
      schedule_no: scheduleNo,
      pro_size: '',
      quantity: '',
      expected_price: expPrice,
      delivery: '',
      plant: '',
      location: '',
      bill_to: billtoId,
      bill_to_state: billState,
      ship_to: shipId,
      ship_to_state: shipState,
      from_date: '',
      to_date: '',
      pay_term: 'Advance Payment',
      remarks: '',
      kam_price: '',
      credit_days: '',
      quote_status: 0,
      valid_till: null,
      confirm_date: '',
      sub_cat_id: '',
      salesRemarks: '',
      pickup_type: '',
      kamsRemarks: '',
      kamsRemarkssp: '',
      kamsRemarkssh: ''
    });
    this.selectedItem[i]['schedule'] = this.quotation;
    this.final_form_data();

  }
  removeSchdl(i:any, schdl:any) {
    this.quotation.splice(-1);
  };

  final_form_data() {
    this.quotation_value = [];
    for (let i = 0; i < this.selectedItem.length; i++) {
      let form_data = this.selectedItem[i]['schedule'];

      for (let k = 0; k < form_data.length; k++) {
        this.quotation_value.push(form_data[k]);
      }
      this.quotation_value[i] = this.selectedItem[i]['schedule'];
    }

  };
}
