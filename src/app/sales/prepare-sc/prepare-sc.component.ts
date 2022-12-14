import { Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-prepare-sc',
  templateUrl: './prepare-sc.component.html',
  styleUrls: ['./prepare-sc.component.scss']
})
export class PrepareScComponent implements OnInit {

  contractTyp: any = [];
  salesPo: any = [];
  orgSales: any = [];
  sapGroup: any = [];
  distribution: any = [];
  sapDivision: any = [];
  salesOffic: any = [];
  modeOfDlvr: any = [];
  p: number = 1;
  showSc: boolean = false;
  showUpdateInfo: boolean = false;
  scData: any;
  poNumber: any;
  scForm: FormGroup;
  updateInfoForm: FormGroup;
  freightItems: any = [];
  freightIndicator: any = [];
  scInfo: any = [];
  priceInfo: any = [];
  customerGrp: any = [];
  specs: any = [];
  permissPerc: any = '';
  incotermsInfo: any = [];
  paymentInfo: any = [];
  matCodeId: any;
  percentArr: any = [];
  rfqNo: any;
  rfqNumber:any;
  userId:any;
  itemNumbr: any = [];
  submit: boolean = false;


  constructor(private _product: ProductsService, private _spiner: NgxSpinnerService,
    private _sales: SalesService, private _location: Location,
    private _router: Router, private _fb: FormBuilder) { }

    get f() {
      return this.scForm.controls;
    };
    
    get ff() {
      return this.updateInfoForm.controls;
    }

  ngOnInit(): void {
    this.getPolist();
    this.contractType();

    this.scForm = this._fb.group({
      po_no: [''],
      contract_ty: ['', Validators.required],
      sales_org: ['', Validators.required],
      dis_chnl: ['', Validators.required],
      div: ['', Validators.required],
      sales_ofc: ['', Validators.required],
      sales_grp: ['', Validators.required],
      qty_cont: ['', Validators.required],
      net_val: ['', Validators.required],
      ContractValidFrom: ['', Validators.required],
      ContractValidTo: ['', Validators.required],
      sold_to_party: ['', Validators.required],
      sold_to_addr: ['', Validators.required],
      ship_to_addr: ['', Validators.required],
      ship_to_party: ['', Validators.required],
      cus_ref: ['', Validators.required],
      cus_ref_dt: ['', Validators.required],
      cost_ref: [''],
      shp_cond: ['', Validators.required],
    })

    this.updateInfoForm = this._fb.group({
      incoterms: ['',Validators.required],
      pay_terms: ['',Validators.required],
      freight: ['',Validators.required],
      cus_grp: ['',Validators.required],
      fr_ind: ['',Validators.required]
    })
  }

  getPolist() {
    this._spiner.show();
    this._sales.getSalesPO().subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        this.salesPo = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  contractType() {
    this._spiner.show();
    this._sales.getSapContractType().subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        this.contractTyp = res.result;
        this.salesOrg();
      }
    })
    this.getdlvrMode();
    this.incoterms();
  };

  salesOrg() {
    this._sales.getSalesOrg().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.orgSales = res.result;
        this.getDistriChnl();
      }
    })
  };

  getSapGroup() {
    this._sales.getSalesSapGroup().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.sapGroup = res.result;
      }
    })
  };

  getDistriChnl() {
    this._sales.getSalesDistri().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.distribution = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    })
  };
  selectDist(event: any) {
    let divData = event.target.value;
    this.getsapDivin(divData);
  }
  getsapDivin(divData: any) {
    let divReq = {
      "distr_chan_code": divData
    }
    this._sales.getSapDivi(divReq).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.sapDivision = res.result;
        this.getOffice();
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    })
  };

  getOffice() {
    this._sales.getSaleOffice().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.salesOffic = res.result;
        this.getSapGroup();
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    })
  };

  getdlvrMode() {
    this._sales.getDlvryMode().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.modeOfDlvr = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    })
  };

  getFreight() {
    this._sales.getSapFreight().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.freightItems = res.result;
        this.custGroup();
      }
    })
  };

  getFreightIndic() {
    this._sales.getFreightIndicat().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.freightIndicator = res.result;
      }
    })
  };

  custGroup() {
    this._sales.getCustGroup().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.customerGrp = res.result;
        this.getFreightIndic();
      }
    })
  };

  incoterms() {
    this._sales.getIncoterms().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.incotermsInfo = res.result;
        this.paymentTerms();
      }
    })
  };

  paymentTerms() {
    this._sales.paymentTerms().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.paymentInfo = res.result;
        this.getFreight();
      }
    })
  };

  updateInfo(index: any) {
    this.permissPerc = '';
    let updatItem = this.scInfo[index];
    this.priceInfo = this.scInfo[index];
    this.showUpdateInfo = !this.showUpdateInfo;
    this.getSpec(this.priceInfo['specs']);
    this.matCodeId = updatItem['mat_code'];
  };

  percent(value: any, matCode: any) {
    let matCodValue = $('#mat_code' + matCode).html();
    let charecValue = $('#charact' + matCode).html();
    let permiPerce = {
      "mat_code": matCodValue,
      "perm_percent": value,
      "umo": '%',
      "character": charecValue
    }
    this.percentArr.push(permiPerce);
  };

  prepareSc(poNumber: any) {
    this.poNumber = poNumber;
    this.showSc = !this.showSc;
    this._spiner.show();
    let apiUrl = '/user/price_break_fetch/' + poNumber;
    this._sales.getMethod(apiUrl).subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        this.scData = res.result[0];
        this.scInfo = res.result;
        this.rfqNumber = this.scData['rfq_no'];
        this.userId = this.scData['user_id'];
        let addrOne = this.scData.addressone;
        let addrTwo = this.scData.addresstwo;
        let fullAddr = (addrOne + ' ' + addrTwo);
        this.scForm.get('qty_cont').setValue(this.scData.qty_ct);
        this.scForm.get('net_val').setValue(this.scData.net_value);
        this.scForm.get('sold_to_party').setValue(this.scData.user_code);
        this.scForm.get('ship_to_party').setValue(this.scData.user_code);
        this.scForm.get('cus_ref').setValue(this.scData.cus_po_no);
        this.scForm.get('cus_ref_dt').setValue(this.scData.po_date);
        this.scForm.get('sold_to_addr').setValue(fullAddr);
        this.scForm.get('ship_to_addr').setValue(fullAddr);
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  getSpec(data: any) {
    let specsData = [
      {
        "comp": "Cr",
        "max": data.cr_max,
        "min": data.cr_min,
      },
      {
        "comp": "C",
        "max": data.c_max,
        "min": data.c_min,
      },
      {
        "comp": "Phos",
        "max": data.phos_max,
        "min": data.phos_min,
      },
      {
        "comp": "S",
        "max": data.s_max,
        "min": data.s_min,

      },
      {
        "comp": "Si",
        "max": data.si_max,
        "min": data.si_min,
      },
      {
        "comp": "Ti",
        "max": data.ti_max,
        "min": data.ti_min,
      }
    ]
    this.specs.push(specsData);
  };

  pricValArr = [];
  getPrice(event: any, i: any) {
    let data = $('#priceVal' + i).html();
    let item = event.target.value;
    let reqParam = {
      "id": i,
      "CnTy": item,
      "Amount": data
    };

    let indxId = this.pricValArr.findIndex((item: any) => item.id == i);
    if (indxId !== -1) {
      this.pricValArr.splice(indxId, 1);
    }
    this.pricValArr.push(reqParam);

  };

  submitSc() {
    const seFormDataArr = [];
    const sapMatArr = [];
    const codePrice = [];
    this.submit = true;
    this.scForm.value['po_no'] = this.poNumber;
    var from = this.scForm.value['ContractValidFrom'];
    var dd = from.replace('-','');
    var mm = dd.replace('-','');
    this.scForm.value['ContractValidFrom'] = mm;

    var till = this.scForm.value['ContractValidTo'];
    var tilldd = till.replace('-','');
    var tillmm = tilldd.replace('-','');
    this.scForm.value['ContractValidTo'] = tillmm;
    
    for (let i = 0; i < this.pricValArr.length; i++) {
      const element = this.pricValArr[i];
      let n = 10;
      for(let y = 1; y <= this.scInfo.length; ++y) {
        let itemNumbr = ( n * y);
        let codePr = {
          "ItemNumber": itemNumbr,
          "CnTy": element.CnTy,
          "Amount": element.Amount
        }
        codePrice.push(codePr)
      }
    };
    let username = 'MJUNCTION_M_PI_DEV';
    let password = 'Welcome@123';
    let authorizationData = 'Basic ' + btoa(username + ':' + password);

    if(this.scForm.invalid) {
      alert('all fields are required !')
      return;
    }
    for (let i = 0; i < this.scInfo.length; i++) {
      const element = this.scInfo[i];
      this.getSpec(this.scInfo[i]['specs']);
      this.rfqNo = this.scInfo[i].rfq_no;
      let n = 10;
      for(let y = 1; y <= this.scInfo.length; ++y) {
        let itemNumbr = ( n * y);
        let sapMaterial = {
          "item": itemNumbr,
          "Material": this.scInfo[i].mat_code,
          "Quantity": this.scInfo[i].tot_qty,
          "CustomarMaterialNumber": this.scInfo[i].mat_code,
          "OrderQuantity": this.scInfo[i].odr_qty,
          "Plant": this.scInfo[i].pcode
        };
        sapMatArr.push(sapMaterial);
      }
      let indxId = this.percentArr.findIndex((item: any) => item.mat_code == this.scInfo[i].mat_code);
      let material =
      {
        "value": "100000",
        "mat_code": this.scInfo[i].mat_code,
        "pcode": this.scInfo[i].pcode,
        "rfq_no": this.scInfo[i].rfq_no,
        "price_det": element['price_det'],
        "specs": this.specs[i],
        "total": this.scInfo[i].total,
        "per_percent": this.percentArr[indxId]
      }
      seFormDataArr.push(material);
    };

    let fullData = {
      "po_details": this.scForm.value,
      "inco_form": this.updateInfoForm.value,
      "material": seFormDataArr
    };
    
    let sapRequest = {
      "OrganizationalData": {
        "ContractType": this.scForm.value['contract_ty'],
        "SalesOrganization": this.scForm.value['sales_org'],
        "DistributionChannel": this.scForm.value['dis_chnl'],
        "Division": this.scForm.value['div'],
        "ContractValidFrom": this.scForm.value['ContractValidFrom'],
        "ContractValidTo": this.scForm.value['ContractValidTo'],
        "Salesoffice": this.scForm.value['sales_ofc'],
        "Salesgroup": this.scForm.value['sales_grp'],
        "Incoterms": this.updateInfoForm.value['incoterms'],
        "Paymentterms": this.updateInfoForm.value['pay_terms']
      },
      "SoldToParty": {
        "QtyContractTSML": this.scForm.value['qty_cont'],
        "Sold_To_Party": this.scForm.value['sold_to_party'],
        "Ship_To_Party": this.scForm.value['ship_to_party'],
        "Cust_Referance": this.scForm.value['cus_ref'],
        "NetValue": this.scForm.value['net_val'],
        "Cust_Ref_Date": this.scForm.value['cus_ref_dt']
      },
      "Sales": {
        "Shp_Cond": this.scForm.value['shp_cond'],
      },
      "Items": sapMatArr,
      "Conditions": codePrice,

      "AdditionalDataA": {
        "Freight": this.updateInfoForm.value['freight'],
        "CustomerGroup4": this.updateInfoForm.value['cus_grp']
      },
      "AdditionalDataforPricing": {
        "FreightIndicator": this.updateInfoForm.value['fr_ind']
      }
    };
    
    let screquest = {
      "scData": sapRequest,
      "basic_auth": authorizationData
    }
    this._spiner.show();
    this._sales.salesContract(screquest).subscribe((res:any) => {
    this._spiner.hide();
      console.log('res',res);
      // if (res.SalesContractRes.Status == 'S') {
      //   alert(res.SalesContractRes.Message);
      // }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
    console.log(sapRequest);
    return;
    this._spiner.show();
    this._sales.submitSalesCnt(fullData).subscribe((res: any) => {
      this._spiner.hide();
      Swal.fire(
        'Success',
        'Submited Successfully',
        'success'
      )
      let ScStatusRequest = {
        "po_no": this.poNumber,
        "status": '5'
      }
      this._sales.poStatus(ScStatusRequest).subscribe((res: any) => {
        this._spiner.hide();
      })

      let userId = localStorage.getItem('USER_ID');
      let camNotiReq = {
        "desc": 'Sales contract has been created',
        "desc_no": this.poNumber,
        "user_id": userId,
        "url_type": 'PO'
      }
      this._product.camNotification(camNotiReq).subscribe((res: any) => {
      })
      let custNotiReq = {
        "desc": 'Sales contract has been created',
        "desc_no": this.poNumber,
        "user_id": userId,
        "url_type": 'PO',
        "sender_id": this.userId
      }
      this._product.custNotiSubmit(custNotiReq).subscribe((res: any) => {
      })

      // progress bar status
      let statusRequest = {
        "rfq_no": this.rfqNumber,
        "sc_created": '1'
      }
      this._product.storeStatusKam(statusRequest).subscribe((res:any) => {
      })

      this._product.storeStatusCust(statusRequest).subscribe((res:any) => {
      })

      // let sc_mail = {
      //   "sc_no":"SC1234",
      //   "po_no":"AIT1234",
      //   "user_id":2
      // }
      // this._sales.sendScMail(sc_mail).subscribe((res:any) => {
      //   console.log(res);
      // })
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  }
  backTo() {
    this._location.back();
  };

}
