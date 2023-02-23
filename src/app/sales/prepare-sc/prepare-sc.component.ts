import { Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';
declare var $: any;
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';

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
  rfqNumber: any;
  userId: any;
  itemNumbr: any = [];
  submit: boolean = false;
  materialArr: any = [];

  dynamicArray = [];
  newDynamic;
  allPlants: any = [];


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
    this.getPlantAll();
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
      incoterms: ['', Validators.required],
      pay_terms: ['', Validators.required],
      freight: ['', Validators.required],
      cus_grp: ['', Validators.required],
      fr_ind: ['', Validators.required]
    })

  }

  getPlantAll() {
    let apiUrl = '/user/get_plants_by_type/PLANT';
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      if (res.message == 'success') {
        this.allPlants = res.result;
      }
    })
  };

  getPolist() {
    this._spiner.show();
    this._sales.getSalesPO().subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.salesPo = decrypted;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    }, err => {
      console.error(err);
      this._spiner.hide();
    })
  };

  contractType() {
    this._spiner.show();
    this._sales.getSapContractType().subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.contractTyp = decrypted;
        this.salesOrg();
      }
    })
    this.getdlvrMode();
    this.incoterms();
  };

  salesOrg() {
    this._sales.getSalesOrg().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.orgSales = decrypted;
        this.getDistriChnl();
      }
    })
  };

  getSapGroup() {
    this._sales.getSalesSapGroup().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.sapGroup = result;
      }
    })
  };

  getDistriChnl() {
    this._sales.getSalesDistri().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.distribution = result;
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
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.sapDivision = result;
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
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.salesOffic = result;
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
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.modeOfDlvr = result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    })
  };

  getFreight() {
    this._sales.getSapFreight().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.freightItems = result;
        this.custGroup();
      }
    })
  };

  getFreightIndic() {
    this._sales.getFreightIndicat().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.freightIndicator = result;
      }
    })
  };

  custGroup() {
    this._sales.getCustGroup().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.customerGrp = result;
        this.getFreightIndic();
      }
    })
  };

  incoterms() {
    this._sales.getIncoterms().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.incotermsInfo = result;
        this.paymentTerms();
      }
    })
  };

  paymentTerms() {
    this._sales.paymentTerms().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.paymentInfo = result;
        this.getFreight();
      }
    })
  };

  matVal: any = [];
  getMaterial(event:any, i:any) {
    let matArr = [];
    this.matVal[i] = event.target.value;
    matArr.push(this.matVal);
    for (let index = 0; index < matArr.length; index++) {
      const element = matArr[index];

    }
  };

  pVal:any = [];
  getPlant(event:any, i:any) {
    let plantArr = [];
    this.pVal[i] = event.target.value;
    plantArr.push(this.pVal);
    for (let index = 0; index < plantArr.length; index++) {
      const plantElement = plantArr[index];

    }
  };


  addRow() {
    this.dynamicArray.push({ matCode: '', ordrQty: '', basicPrc: this.scData?.price_det[0]['amt'], cnty: '', value: '', plant: '', });

  };

  deleteRow(index: any) {
    this.dynamicArray.splice(index, 1);
  };

  // updateInfo(index: any) {
  //   this.permissPerc = '';
  //   let updatItem = this.scInfo[index];
  //   this.priceInfo = this.scInfo[index];
  //   this.showUpdateInfo = !this.showUpdateInfo;
  //   this.getSpec(this.priceInfo['specs']);
  //   this.matCodeId = updatItem['mat_code'];
  // };

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
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.scData = result[0];
        this.scInfo = result;
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
    this.submit = true;
    this.scForm.value['po_no'] = this.poNumber;
    var from = this.scForm.value['ContractValidFrom'];
    var dd = from.replace('-', '');
    var mm = dd.replace('-', '');
    this.scForm.value['ContractValidFrom'] = mm;

    var till = this.scForm.value['ContractValidTo'];
    var tilldd = till.replace('-', '');
    var tillmm = tilldd.replace('-', '');
    this.scForm.value['ContractValidTo'] = tillmm;

    if (this.scForm.invalid) {
      alert('all fields are required !')
      return;
    }

    for (let index = 0; index < this.dynamicArray.length; index++) {
      const element = this.dynamicArray[index];

      let sapMaterial = [{
        "item": 10 * (index + 1),
        "Material": element.matCode,
        "Quantity": element.ordrQty,
        "CustomarMaterialNumber": element.matCode,
        "OrderQuantity": element.ordrQty,
        "Plant": element.plant
      }];


      let codePr = [{
        "ItemNumber": 10 * (index + 1),
        "CnTy": element.cnty,
        "Amount": element.ordrQty * element.basicPrc
      }];

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
        "Items": sapMaterial,
        "Conditions": codePr,

        "AdditionalDataA": {
          "Freight": this.updateInfoForm.value['freight'],
          "CustomerGroup4": this.updateInfoForm.value['cus_grp']
        },
        "AdditionalDataforPricing": {
          "FreightIndicator": this.updateInfoForm.value['fr_ind']
        }
      };

      seFormDataArr.push(sapRequest);
    }
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(seFormDataArr, passwordd);

    this._spiner.show();
    this._sales.scInExcelSave(encryptedd).subscribe((res: any) => {
      this._spiner.hide();
      if (res.message == 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '',
          showConfirmButton: false,
          timer: 1500
        })
        let param = {
          email: 'srvmondal88@gmail.com',
          ids: res.result['ids']
        }
        this._sales.excelEmail(param).subscribe((res: any) => {
        })

        this.getPolist();
        this._router.navigate(['/sales/update-info'])
      }

    }, err => {
      console.log(err);
      this._spiner.hide();
    })
    // this._spiner.show();
    // this._sales.salesContract(sapRequest).subscribe((res: any) => {
    //   this._spiner.hide();
    //   console.log('res', res);

    // }, err => {
    //   console.log(err);
    //   this._spiner.hide();
    // })
    // console.log(sapRequest);
    // return;
    // this._spiner.show();
    // this._sales.submitSalesCnt(fullData).subscribe((res: any) => {
    //   this._spiner.hide();
    //   Swal.fire(
    //     'Success',
    //     'Submited Successfully',
    //     'success'
    //   )
    //   let ScStatusRequest = {
    //     "po_no": this.poNumber,
    //     "status": '5'
    //   }
    //   this._sales.poStatus(ScStatusRequest).subscribe((res: any) => {
    //     this._spiner.hide();
    //   })

    //   let userId = localStorage.getItem('USER_ID');
    //   let camNotiReq = {
    //     "desc": 'Sales contract has been created',
    //     "desc_no": this.poNumber,
    //     "user_id": userId,
    //     "url_type": 'PO'
    //   }
    //   this._product.camNotification(camNotiReq).subscribe((res: any) => {
    //   })
    //   let custNotiReq = {
    //     "desc": 'Sales contract has been created',
    //     "desc_no": this.poNumber,
    //     "user_id": userId,
    //     "url_type": 'PO',
    //     "sender_id": this.userId
    //   }
    //   this._product.custNotiSubmit(custNotiReq).subscribe((res: any) => {
    //   })

    //   let statusRequest = {
    //     "rfq_no": this.rfqNumber,
    //     "sc_created": '1'
    //   }
    //   this._product.storeStatusKam(statusRequest).subscribe((res: any) => {
    //   })

    //   this._product.storeStatusCust(statusRequest).subscribe((res: any) => {
    //   })

    // }, err => {
    //   console.log(err);
    //   this._spiner.hide();
    // })
  };

  backTo() {
    this._location.back();
  };

}
