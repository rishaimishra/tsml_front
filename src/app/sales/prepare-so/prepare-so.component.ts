import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';
declare var $: any;
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';
import { ToastrService } from 'ngx-toastr';

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
  submit: boolean = false;
  transactId:any;
  userId:any;
  constructor(private _sales: SalesService, private _spiner: NgxSpinnerService,
    private _fb: FormBuilder, private _router: Router,
    private _product: ProductsService, private _toater: ToastrService) { }

  ngOnInit(): void {
    this.getPolist();

  }

  getPolist() {
    this._spiner.show();
    this._sales.getSalesPO().subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'success') {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.salesPo = decrypted;
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
        this.soDetails = res.result;
        this.transactId = res.result['sc_id'];
        this.userid = res.result['user_id'];
        $('#contrtNum').val(this.soDetails.sc_no);
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  submitSo() {
    let order_type = $('#ordertyp_').val();
    let salesOrg = $('#salesOrg_').val();
    let distrib = $('#distrib_').val();
    let divisi = $('#divisi_').val();
    let salesOffc = $('#salesOffc_').val();
    let salesGrp = $('#salesGrp_').val();
    let contrtNum = $('#contrtNum').val();
    let paymGur = $('#paymGur_').val();
    let financia = $('#financia_').val();
    if (order_type == '') {
      this._toater.error('Ordert Type is required');
      return;
    }
    else if(salesOrg == '') {
      this._toater.error('Sales Organization is required');
      return;
    }
    else if(paymGur == '') {
      this._toater.error('Payment Guarantee Proc is required');
      return;
    }
    else if(contrtNum == '') {
      this._toater.error('Contract Number is required');
      return;
    }
    else if(financia == '') {
      this._toater.error('Financial Document number is required');
      return;
    }
    let sapSoReq = {
      "OrganizationalData": {
        "OrderType": order_type,
        "SalesOrganization": salesOrg,
        "DistributionChannel": distrib,
        "Division": divisi,
        "Salesoffice": salesOffc,
        "Salesgroup": salesGrp,
      },
      "Contract": {
        "ContractNumber": contrtNum
      }
    };

    let loaclData = {
      "transact_id": this.transactId,
      "co_no": this.soDetails.sc_no,
      "po_no": this.poNumber,
      "pay_proc": paymGur,
      "fin_doc_no": financia,
      "user_id": this.soDetails.user_id,
      "order_type": order_type,
      "sales_org": salesOrg,
      "dis_chnl": distrib,
      "division": divisi,
      "sales_ofc": salesOffc,
      "sales_grp": salesGrp
    };

    this._spiner.show();
    this._sales.sapSoReq(sapSoReq).subscribe((res: any) => {
      this._spiner.hide();
      if (res.Status == 'S') {
        Swal.fire({
          title: res.SalesOrderNumber,
          text: res.Message,
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this._router.navigate(['/sales/prepare-so']);
            this.getPolist();
          }
        })
      }
      else if(res.Status == 'E') {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: res.Message,
        })
      }
    }, err => {
      console.log(err)
      this._spiner.hide()
    })

    this._spiner.show();
    this._sales.submitSalesSo(loaclData).subscribe((res: any) => {
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
    this._sales.getOrderType().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        // let password = '123456';
        // let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.contType = res.result;
        this.salesOrg();
      }
    })
  };

  salesOrg() {
    this._sales.getSalesOrg().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.orgSales = decrypted;
        this.getDistribution();
      }
    })
  };

  getDistribution() {
    this._sales.getSalesDistri().subscribe((res: any) => {
      if (res.status == 1 && res.message == 'success') {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.distribution = decrypted;
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
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.sapDivision = decrypted;
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
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.salesOffic = decrypted;
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
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.sapGroup = decrypted;
      }
    })
  }
}
