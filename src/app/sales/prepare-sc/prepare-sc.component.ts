import { Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';
declare var $: any;
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  allPlants: any = [];

  length: number;
  IncoTermCtrl: FormControl;
  pymntCtrl: FormControl;
  freightCtrl: FormControl;
  custCtrl: FormControl;
  freightIndCtrl: FormControl;
  contrctCtrl: FormControl;
  salesOrgCtrl: FormControl;
  distriCtrl: FormControl;
  diviCtrl: FormControl;
  officeCtrl: FormControl;
  salesGrpCtrl: FormControl;
  modeCtrl: FormControl;

  filteredInco: Observable<any[]>;
  filteredPymt: Observable<any[]>;
  // @ViewChild('stateInput') inputField : ElementRef;
  incoTermVal:any;
  pymatVal:any;
  filteredFreit: Observable<any[]>;
  freightVal:any;
  filteredCust: Observable<any[]>;
  customerVal:any;
  filteredFreitIndi: Observable<any[]>;
  freightIndiVal:any;
  filteredContrt: Observable<any[]>;
  contrctVal:any;
  filteredSlOrg: Observable<any[]>;
  salesOrgVal:any;
  filteredDistri: Observable<any[]>;
  distribVal:any;
  filteredDivi: Observable<any[]>;
  divisVal:any;
  filteredOffice: Observable<any[]>;
  officeVal:any;
  filteredSlGrp: Observable<any[]>;
  salesGrpVal:any;
  filteredMode: Observable<any[]>;
  modeVal:any;
  matarial:any = [];

  constructor(private _product: ProductsService, private _spiner: NgxSpinnerService,
    private _sales: SalesService, private _location: Location,
    private _router: Router, private _fb: FormBuilder) { }

  get f() {
    return this.scForm.controls;
  };

  get ff() {
    return this.updateInfoForm.controls;
  };

  ngOnInit(): void {
    this.getPolist();
    this.contractType();
    this.getPlantAll();
    this.scForm = this._fb.group({
      po_no: [''],
      contract_ty: [''],
      sales_org: [''],
      dis_chnl: [''],
      div: [''],
      sales_ofc: [''],
      sales_grp: [''],
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
      shp_cond: [''],
    })

    this.updateInfoForm = this._fb.group({
      incoterms: [''],
      pay_terms: [''],
      freight: [''],
      cus_grp: [''],
      fr_ind: ['']
    })

  };

  getPlantAll() {
    let apiUrl = '/user/get_plants_by_type/PLANT';
    this._product.getMethod(apiUrl).subscribe((res: any) => {
      if (res.message == 'success') {
        let plant = res.result;
        for (let i = 0; i < plant.length; i++) {
          const element = plant[i];
          this.allPlants.push(element);
        }
      }
    })
    let apiUrl2 = '/user/get_plants_by_type/DEPOT';
    this._product.getMethod(apiUrl2).subscribe((res: any) => {
      if (res.message == 'success') {
        let plant = res.result;
        for (let i = 0; i < plant.length; i++) {
          const element = plant[i];
          this.allPlants.push(element);
        }
      }
    })
    console.log('FGFGHFGH', this.allPlants);
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
      }
    })
    this.contrctCtrl = new FormControl();
    this.filteredContrt = this.contrctCtrl.valueChanges
      .pipe(
        startWith(''),
        map(contrct => contrct ? this.filterContct(contrct) : this.contractTyp.slice())
    );

    this.salesOrg();
    this.getdlvrMode();
    this.incoterms();
    this.getOffice();
  };

  filterContct(name: string) {
    return this.contractTyp.filter(ctrct => 
      ctrct.contract_type_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onContrct(event:any) {
    this.contrctVal = event.source.value;
  };

  salesOrg() {
    this._sales.getSalesOrg().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.orgSales = decrypted;
      }
    })
    this.getDistriChnl();
    this.salesOrgCtrl = new FormControl();
    this.filteredSlOrg = this.salesOrgCtrl.valueChanges
      .pipe(
        startWith(''),
        map(org => org ? this.filterSalOrg(org) : this.orgSales.slice())
    );
  };
  filterSalOrg(name: string) {
    return this.orgSales.filter(org => 
      org.sales_orgerms_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onSalesOrg(event:any) {
    this.salesOrgVal = event.source.value;
  };

  getSapGroup() {
    this._sales.getSalesSapGroup().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.sapGroup = result;
      }
    })
    this.salesGrpCtrl = new FormControl();
    this.filteredSlGrp = this.salesGrpCtrl.valueChanges
      .pipe(
        startWith(''),
        map(grp => grp ? this.filterSalGrp(grp) : this.sapGroup.slice())
    );
  };

  filterSalGrp(name: string) {
    return this.sapGroup.filter(grp => 
      grp.sales_group_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onSalesGrp(event:any) {
    this.salesGrpVal = event.source.value;
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
    this.distriCtrl = new FormControl();
    this.filteredDistri= this.distriCtrl.valueChanges
      .pipe(
        startWith(''),
        map(divich => divich ? this.filterDistri(divich) : this.distribution.slice())
    );
  };
  filterDistri(name: string) {
    return this.distribution.filter(distch => 
      distch.distr_chan_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onDistrib(event:any) {
    this.distribVal = event.source.value;
    this.getsapDivin(this.distribVal);
  };

  getsapDivin(divData: any) {
    let divReq = {
      "distr_chan_code": divData
    }
    this._sales.getSapDivi(divReq).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.sapDivision = result;

      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    })

    this.diviCtrl = new FormControl();
    this.filteredDivi= this.diviCtrl.valueChanges
      .pipe(
        startWith(''),
        map(divi => divi ? this.filterDiviCh(divi) : this.sapDivision.slice())
    );
  };
  
  filterDiviCh(name: string) {
    return this.sapDivision.filter(divi => 
      divi.division_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onDiviCh(event:any) {
    this.divisVal = event.source.value;
  };

  getOffice() {
    this._sales.getSaleOffice().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.salesOffic = result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login'])
      }
    })
    this.getSapGroup();
    this.officeCtrl = new FormControl();
    this.filteredOffice= this.officeCtrl.valueChanges
      .pipe(
        startWith(''),
        map(offi => offi ? this.filterOffice(offi) : this.salesOffic.slice())
    );

  };

  filterOffice(name: string) {
    return this.salesOffic.filter(office => 
      office.sales_office_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onOffice(event:any) {
    this.officeVal = event.source.value;
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

    this.modeCtrl = new FormControl();
    this.filteredMode= this.modeCtrl.valueChanges
      .pipe(
        startWith(''),
        map(mode => mode ? this.filterMode(mode) : this.modeOfDlvr.slice())
    );
  };
  filterMode(name: string) {
    return this.modeOfDlvr.filter(mod => 
      mod.delivery_mode_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };

  onMode(event:any) {
    this.modeVal = event.source.value;
  };

  getFreight() {
    this._sales.getSapFreight().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.freightItems = result;
      }
    })
    this.custGroup();
    this.freightCtrl = new FormControl();
    this.filteredFreit = this.freightCtrl.valueChanges
      .pipe(
        startWith(''),
        map(freight => freight ? this.filterFreight(freight) : this.freightItems.slice())
    );
  };

  filterFreight(name: string) {
    return this.freightItems.filter(freit => 
      freit.freight_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onEnterFrei(event:any) {
    this.freightVal = event.source.value;
  };

  getFreightIndic() {
    this._sales.getFreightIndicat().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.freightIndicator = result;
      }
    })
    this.freightIndCtrl = new FormControl();
    this.filteredFreitIndi = this.freightIndCtrl.valueChanges
      .pipe(
        startWith(''),
        map(freiInd => freiInd ? this.filterFreightInd(freiInd) : this.freightIndicator.slice())
    );
  };

  filterFreightInd(name: string) {
    return this.freightIndicator.filter(indi => 
      indi.freight_indication_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onEnterIndi(event:any) {
    this.freightIndiVal = event.source.value;
  };

  custGroup() {
    this._sales.getCustGroup().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.customerGrp = result;
      }
    })
    this.getFreightIndic();
    this.custCtrl = new FormControl();
    this.filteredCust = this.custCtrl.valueChanges
      .pipe(
        startWith(''),
        map(cust => cust ? this.filterCust(cust) : this.customerGrp.slice())
    );
  };
  filterCust(name: string) {
    return this.customerGrp.filter(cust => 
      cust.cus_group_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };
  onEnterCust(event:any) {
    this.customerVal = event.source.value;
  };

  incoterms() {
    this._sales.getIncoterms().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.incotermsInfo = result;
      }
    })
    this.paymentTerms();

    this.IncoTermCtrl = new FormControl();
    this.filteredInco = this.IncoTermCtrl.valueChanges
      .pipe(
        startWith(''),
        map(incoTerm => incoTerm ? this.filterInco(incoTerm) : this.incotermsInfo.slice())
    );
  };
  onEnter(event:any) {
    this.incoTermVal = event.source.value;
  };
  filterInco(name: string) {
    return this.incotermsInfo.filter(inco => 
      inco.incoterms_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };

  paymentTerms() {
    this._sales.paymentTerms().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password);
        this.paymentInfo = result;
      }
    })
    this.getFreight();

    this.pymntCtrl = new FormControl();
    this.filteredPymt = this.pymntCtrl.valueChanges
      .pipe(
        startWith(''),
        map(pymnt => pymnt ? this.filterPaymt(pymnt) : this.paymentInfo.slice())
    );
  };

  filterPaymt(name: string) {
    return this.paymentInfo.filter(pymt => 
      pymt.payment_terms_code.toLowerCase().indexOf(name.toLowerCase()) === 0);
  };

  onEnterPymt(event:any) {
    this.pymatVal = event.source.value;
  };
  
  matVal: any = [];
  getMaterial(event: any, i: any) {
    let matArr = [];
    this.matVal[i] = event.target.value;
    matArr.push(this.matVal);
    for (let index = 0; index < matArr.length; index++) {
      const element = matArr[index];

    }
  };

  pVal: any = [];
  getPlant(event: any, i: any) {
    let plantArr = [];
    this.pVal[i] = event.target.value;
    plantArr.push(this.pVal);
    for (let index = 0; index < plantArr.length; index++) {
      const plantElement = plantArr[index];

    }
  };

  addRow() {
    this.dynamicArray.push({ matCode: '', ordrQty: '', basicPrc: this.scData.net_value, cnty: '', value: '', plant: '', });

  };

  deleteRow(index: any) {
    this.dynamicArray.splice(index, 1);
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

    this._sales.getMaterial().subscribe((res:any) => {
      console.log(res);
      if(res.message == 'success') {
        this.matarial = res.result;
      }
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
    this.updateInfoForm.value['incoterms'] = this.incoTermVal;
    this.updateInfoForm.value['pay_terms'] = this.pymatVal;
    this.updateInfoForm.value['freight'] = this.freightVal;
    this.updateInfoForm.value['cus_grp'] = this.customerVal;
    this.updateInfoForm.value['fr_ind'] = this.freightIndiVal;
    this.scForm.value['contract_ty'] = this.contrctVal;
    this.scForm.value['sales_org'] = this.salesOrgVal;
    this.scForm.value['dis_chnl'] = this.distribVal;
    this.scForm.value['div'] = this.divisVal;
    this.scForm.value['sales_ofc'] = this.officeVal;
    this.scForm.value['sales_grp'] = this.salesGrpVal;
    this.scForm.value['shp_cond'] = this.modeVal;
    

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

    var custRefDt = $('#custRefdate').val();
    var custDt = custRefDt.replace('-', '');
    var custDm = custDt.replace('-', '');
    let custRefDate = this.scForm.value['Cust_Ref_Date'] = custDm;

    // if (this.scForm.invalid) {
    //   return;
    // }
    let username = 'MJUNCTION_M_PI_DEV';
    let password = 'Welcome@123';
    let authorizationData = 'Basic ' + btoa(username + ':' + password);

    for (let index = 0; index < this.dynamicArray.length; index++) {
      const element = this.dynamicArray[index];

      // let sapMaterial = [{
      //   "item": 10 * (index + 1),
      //   "Material": element.matCode,
      //   "Quantity": element.ordrQty,
      //   "CustomarMaterialNumber": element.matCode,
      //   "OrderQuantity": element.ordrQty,
      //   "Plant": element.plant
      // }];

      // let codePr = [{
      //   "ItemNumber": 10 * (index + 1),
      //   "CnTy": element.cnty,
      //   "Amount": element.ordrQty * element.basicPrc
      // }];

      // let sapRequest = {
      //   "OrganizationalData": {
      //     "ContractType": this.scForm.value['contract_ty'],
      //     "SalesOrganization": this.scForm.value['sales_org'],
      //     "DistributionChannel": this.scForm.value['dis_chnl'],
      //     "Division": this.scForm.value['div'],
      //     "ContractValidFrom": this.scForm.value['ContractValidFrom'],
      //     "ContractValidTo": this.scForm.value['ContractValidTo'],
      //     "Salesoffice": this.scForm.value['sales_ofc'],
      //     "Salesgroup": this.scForm.value['sales_grp'],
      //     "Incoterms": this.updateInfoForm.value['incoterms'],
      //     "Paymentterms": this.updateInfoForm.value['pay_terms']
      //   },
      //   "SoldToParty": {
      //     "QtyContractTSML": this.scForm.value['qty_cont'],
      //     "Sold_To_Party": this.scForm.value['sold_to_party'],
      //     "Ship_To_Party": this.scForm.value['ship_to_party'],
      //     "Cust_Referance": this.scForm.value['cus_ref'],
      //     "NetValue": this.scForm.value['net_val'],
      //     "Cust_Ref_Date": this.scForm.value['cus_ref_dt']
      //   },
      //   "Sales": {
      //     "Shp_Cond": this.scForm.value['shp_cond'],
      //   },
      //   "Items": sapMaterial,
      //   "Conditions": codePr,

      //   "AdditionalDataA": {
      //     "Freight": this.updateInfoForm.value['freight'],
      //     "CustomerGroup4": this.updateInfoForm.value['cus_grp']
      //   },
      //   "AdditionalDataforPricing": {
      //     "FreightIndicator": this.updateInfoForm.value['fr_ind']
      //   }
      // };

      // seFormDataArr.push(sapRequest);
    }

    for (let i = 0; i < this.scInfo.length; i++) {
      const element = this.scInfo[i];
      this.getSpec(this.scInfo[i]['specs']);
      this.rfqNo = this.scInfo[i].rfq_no;
      let n = 10;
      for (let y = 1; y <= this.scInfo.length; ++y) {
        let itemNumbr = (n * y);
        let sapMaterial = {
          "Item": itemNumbr,
          "Material": this.scInfo[i].mat_code,
          "Quantity": this.scInfo[i].tot_qty,
          "CustomarMaterialNumber": this.scInfo[i].mat_code,
          "OrderQuantity": this.scInfo[i].odr_qty,
          "Plant": this.scInfo[i].pcode
        };
        sapMatArr.push(sapMaterial);
      }
      let indxId = this.percentArr.findIndex((item: any) => item.mat_code == this.scInfo[i].mat_code);
      let material = {
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

    /* START JASON FOR SAP API   */
    let fullData = {
      "po_details": this.scForm.value,
      "inco_form": this.updateInfoForm.value,
      "material": seFormDataArr
    };

    /* START JASON FOR SAP API   */
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
        "Cust_Ref_Date": custRefDate
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
    console.log(fullData);
    return;
    this._spiner.show();
    this._sales.salesContract(screquest).subscribe((res: any) => {
      this._spiner.hide();
      if (res.SalesContractRes.Status == 'S') {
        Swal.fire({
          title: res.SalesContractRes['ContractNumber'],
          text: res.SalesContractRes['Message'],
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Go for SO!'
        }).then((result) => {
          if (result.isConfirmed) {
            this._router.navigate(['/sales/prepare-so'])
          }
        })
        this.otherFuncApi(fullData, res.SalesContractRes['ContractNumber'])
      }
      else if(res.SalesContractRes.Status == 'E') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.SalesContractRes.Message,
        })
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  otherFuncApi(fullData: any, sc_no: any) {
    this._spiner.show();
    this._sales.submitSalesCnt(fullData).subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1) {
        this.updateContract(sc_no, res.result);
      }
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

      let statusRequest = {
        "rfq_no": this.rfqNumber,
        "sc_created": '1'
      }
      this._product.storeStatusKam(statusRequest).subscribe((res: any) => {
      })

      this._product.storeStatusCust(statusRequest).subscribe((res: any) => {
      })

    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  updateContract(sc_no: any, result: any) {
    const d = new Date();
    let date_ = d.toLocaleDateString();
    let param = {
      "date": date_,
      "sc_no": sc_no,
      "id": result
    }
    this._sales.updateContractNo(param).subscribe();
  };

  backTo() {
    this._location.back();
  };

}
