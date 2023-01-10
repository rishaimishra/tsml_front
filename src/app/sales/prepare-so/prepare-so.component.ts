import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-prepare-so',
  templateUrl: './prepare-so.component.html',
  styleUrls: ['./prepare-so.component.scss']
})
export class PrepareSoComponent implements OnInit {
  salesPo: any = [];
  showSoInput: boolean = false;
  contType: any = [];
  soDetails: any = [];
  distribution: any = [];
  poNumber: any;
  paymentGu: any = '';
  fncilDoc: any = '';
  p: number = 1;
  orgSales: any = [];
  sapDivision: any = [];
  salesOffic: any = [];
  sapGroup: any = [];
  rfqNumber: any;
  userid: any;

  odrType: any;
  salesOrgniz: any;
  disChanel: any;
  divisin: any;
  salesOffice: any;
  salesGroup: any;
  soForm: FormGroup;
  submit: boolean = false;

  constructor(private _sales: SalesService, private _spiner: NgxSpinnerService,
    private _fb: FormBuilder, private _router: Router,
    private _product: ProductsService) { }

  get f() {
    return this.soForm.controls;
  };

  ngOnInit(): void {
    this.getPolist();
    this.soForm = this._fb.group({
      transact_id: [''],
      co_no: ['', Validators.required],
      po_no: [''],
      pay_proc: ['',Validators.required],
      fin_doc_no: ['', Validators.required],
      user_id: [''],
      order_type: ['', Validators.required],
      sales_org: ['', Validators.required],
      dis_chnl: ['', Validators.required],
      division: ['', Validators.required],
      sales_ofc: ['', Validators.required],
      sales_grp: ['', Validators.required]
    })
  }

  getPolist() {
    this._spiner.show();
    this._sales.getSalesPO().subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        this.salesPo = res.result;
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })

    this.getContract();
  };

  prepareSo(sc_no: any, po_no: any, rfqNo: any) {
    this.rfqNumber = rfqNo;
    this._spiner.show();
    this.poNumber = po_no;
    let apiUrl = '/user/get_so_sc/' + sc_no;
    this.showSoInput = !this.showSoInput;
    this._sales.getMethod(apiUrl).subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        this.soDetails = res.result[0];
        this.soForm.get('transact_id').setValue(this.soDetails.transactid);
        this.soForm.get('co_no').setValue(this.soDetails.sc_no);
        this.soForm.get('po_no').setValue(this.poNumber);
        this.soForm.get('user_id').setValue(this.soDetails.uid);
        console.log(this.soDetails.sc_no);
        this.userid = this.soDetails['uid'];
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  submitSo() {
    console.log(this.soForm.value);
    this.submit = true;
    let sapSoReq = {
      "OrganizationalData": {
        "OrderType": this.soForm.value['order_type'],
        "SalesOrganization": this.soForm.value['sales_org'],
        "DistributionChannel": this.soForm.value['dis_chnl'],
        "Division": this.soForm.value['division'],
        "Salesoffice": this.soForm.value['sales_ofc'],
        "Salesgroup": this.soForm.value['sales_grp']
      },
      "Contract": {
        "ContractNumber": this.soForm.value['co_no']
      }
    };

    this._spiner.show();
    this._sales.sapSoReq(sapSoReq).subscribe((res: any) => {
      this._spiner.hide();
      if (res.Status == 'S') {
        alert(res.Message);
      }
    }, err => {
      console.log(err)
      this._spiner.hide()
    })

    return;

    this._spiner.show();
    this._sales.submitSalesSo(this.soForm.value).subscribe((res: any) => {
      Swal.fire(
        'Success',
        'Submited Successfully',
        'success'
      )
      this._spiner.hide();

      let SoStatusRequest = {
        "po_no": this.poNumber,
        "status": '6'
      }
      this._sales.poStatus(SoStatusRequest).subscribe((res: any) => {
        console.log(res);
      })

      let userId = localStorage.getItem('USER_ID');
      let camNotiReq = {
        "desc": 'Sales order has been created',
        "desc_no": this.poNumber,
        "user_id": userId,
        "url_type": 'P'
      }
      this._product.camNotification(camNotiReq).subscribe((res: any) => {
      })

      // notification
      let notiReqCust = {
        "desc": 'Sales order has been created',
        "desc_no": this.poNumber,
        "user_id": userId,
        "url_type": 'P',
        "sender_id": this.userid

      }
      this._product.custNotiSubmit(notiReqCust).subscribe((res: any) => {
      })

      // progress bar status
      let statusRequest = {
        "rfq_no": this.rfqNumber,
        "so_created": '1'
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

  getContract() {
    this._sales.getSapContractType().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.contType = res.result;
        this.salesOrg();
      }
    })
  };

  salesOrg() {
    this._sales.getSalesOrg().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.orgSales = res.result;
        this.getDistribution();
      }
    })
  };

  getDistribution() {
    this._sales.getSalesDistri().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.distribution = res.result;
      }
    })
  };

  selectDist(event: any) {
    let divData = event.target.value;
    this.getsapDivin(divData);
  };

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

  getSapGroup() {
    this._sales.getSalesSapGroup().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        this.sapGroup = res.result;
      }
    })
  }
}
