import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';
import { SalesService } from 'src/app/service/sales.service';

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
  freightItems:any = [];
  freightIndicator:any = [];


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
      ship_to_party: [''],
      cus_ref: [''],
      cus_ref_dt: [''],
      cost_ref: [''],
      shp_cond: [''],
    })
  }

  getPolist() {
    this._sales.getSalesPO().subscribe((res: any) => {
      console.log('resss', res);
      if (res.status == 1 && res.message == 'success') {
        this.salesPo = res.result;
      }
    })
  };

  contractType() {
    this._spiner.show();
    this._sales.getSapContractType().subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        this.contractTyp = res.result;
      }
    })
    this.salesOrg();
    this.getSapGroup();
    this.getDistriChnl();
    this.getOffice();
    this.getdlvrMode();
    this.getFreight();
    this.getFreightIndic();
  };

  salesOrg() {
    this._sales.getSalesOrg().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.orgSales = res.result;
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
  selectDist(event:any) {
    let divData = event.target.value;
    console.log(divData);
    this.getsapDivin(divData);
  }
  getsapDivin(divData:any) {
    let divReq = {
      "distr_chan_code": divData
    }
    this._sales.getSapDivi(divReq).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.sapDivision = res.result;
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
    this._sales.getSapFreight().subscribe((res:any) => {
      console.log(res);
      if(res.status == 1 && res.message == 'success') {
        this.freightItems = res.result;
      }
    })
  };

  getFreightIndic() {
    this._sales.getFreightIndicat().subscribe((res:any) => {
      console.log(res);
      if(res.status == 1 && res.message == 'success') {
        this.freightIndicator = res.result;
      }
    })
  }
  updateInfo() {
    this.showUpdateInfo = !this.showUpdateInfo;
  };

  prepareSc(poNumber: any) {
    // document.getElementById("targetForm").scrollIntoView({
    //   behavior: "smooth",
    //   block: "start",
    //   inline: "nearest"
    // });
    this.poNumber = poNumber;
    this.showSc = !this.showSc;
    let apiUrl = '/user/price_break_fetch/' + poNumber;
    this._sales.getMethod(apiUrl).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.scData = res.result[0];
        console.log(this.scData);
        this.scForm.get('qty_cont').setValue(this.scData.qty_ct);
        this.scForm.get('net_val').setValue(this.scData.net_value);
        this.scForm.get('sold_to_party').setValue(this.scData.user_code);
        this.scForm.get('ship_to_party').setValue(this.scData.user_code);
        this.scForm.get('cus_ref').setValue(this.scData.cus_po_no);
        this.scForm.get('cus_ref_dt').setValue(this.scData.po_date);
      }
    })
  }
  backTo() {
    this._location.back();
  }
}
