import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  matCodeId:any;
  percentArr:any = [];


  constructor(private _product: ProductsService, private _spiner: NgxSpinnerService,
    private _sales: SalesService, private _location: Location,
    private _router: Router, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.getPolist();
    this.contractType();

    this.scForm = this._fb.group({
      po_no: [''],
      contract_ty: [''],
      sales_org: [''],
      dis_chnl: [''],
      div: [''],
      sales_ofc: [''],
      sales_grp: [''],
      qty_cont: [''],
      net_val: [''],
      sold_to_party: [''],
      sold_to_addr: [''],
      ship_to_addr: [''],
      ship_to_party: [''],
      cus_ref: [''],
      cus_ref_dt: [''],
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

  percent(value:any, matCode:any) {
    let matCodValue = $('#mat_code'+matCode).html();
    let charecValue = $('#charact'+matCode).html();
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
        let addrOne = this.scData.addressone;
        let addrTwo = this.scData.addresstwo;
        let fullAddr = (addrOne + ' '+ addrTwo);
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

  submitSc() {
    this._spiner.show();
    const seFormDataArr = [];
    this.scForm.value['po_no'] = this.poNumber;
    for (let i = 0; i < this.scInfo.length; i++) {
      const element = this.scInfo[i];
      this.getSpec(this.scInfo[i]['specs']);

      let material =
        { 
          "value": "100000",
          "mat_code": this.scInfo[i].mat_code,
          "pcode": this.scInfo[i].pcode,
          "rfq_no": this.scInfo[i].rfq_no,
          "price_det": element['price_det'],
          "specs": this.specs[i],
          "total": this.scInfo[i].total,
          "per_percent": this.percentArr[i]
        }
      seFormDataArr.push(material);
    }
    let fullData = {
      "po_details": this.scForm.value,
      "inco_form": this.updateInfoForm.value,
      "material": seFormDataArr
    }

    this._sales.submitSalesCnt(fullData).subscribe((res:any) => {
    this._spiner.hide();
      console.log(res);
        Swal.fire(
          'Success',
          'Submited Successfully',
          'success'
        )
    }, err => {
      console.log(err);
    this._spiner.hide();
    })
  }
  backTo() {
    this._location.back();
  };

}
