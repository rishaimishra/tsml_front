import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prepare-so',
  templateUrl: './prepare-so.component.html',
  styleUrls: ['./prepare-so.component.scss']
})
export class PrepareSoComponent implements OnInit {
  salesPo: any = [];
  showSoInput: boolean = false;
  contType:any = [];
  soDetails:any = [];
  distribution:any = [];
  poNumber:any;
  paymentGu:any = '';
  fncilDoc:any = '';
  orderType: any;



  constructor(private _sales: SalesService, private _spiner: NgxSpinnerService,
    private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.getPolist();
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

  prepareSo(sc_no:any,po_no:any) {
    this._spiner.show();
    this.poNumber = po_no;
    let apiUrl = '/user/get_so_sc/'+sc_no;
    this.showSoInput = !this.showSoInput;
    this._sales.getMethod(apiUrl).subscribe((res:any) => {
      this._spiner.hide();
      console.log(res);
      if(res.status == 1 && res.message == 'success') {
        this.soDetails = res.result[0];
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };
  
  submitSo() {
    let submitSoData = {
      transact_id: this.soDetails.transactid,
      co_no: this.soDetails.sc_no,
      po_no:  this.poNumber,
      pay_proc: this.paymentGu,
      fin_doc_no: this.fncilDoc,
      user_id: this.soDetails.uid,
      order_type: this.orderType,
      sales_org: this.soDetails.id,
      dis_chnl: this.soDetails.disid,
      division: this.soDetails.divid,
      sales_ofc: this.soDetails.ofcid,
      sales_grp: this.soDetails.salesid
    };
    this._spiner.show();
    console.log(submitSoData);
    this._sales.submitSalesSo(submitSoData).subscribe((res:any) => {
      console.log(res);
      Swal.fire(
        'Success',
        'Submited Successfully',
        'success'
      )
      this._spiner.hide();
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  }
  getContract() {
    this._sales.getSapContractType().subscribe((res:any) => {
      if (res.status ==1 && res.message == 'success') {
        this.contType = res.result;
        this.getDistribution();
      }
    })
  }

  getDistribution() {
    this._sales.getSalesDistri().subscribe((res:any) => {
      if (res.status ==1 && res.message == 'success') {
        this.distribution = res.result;
      }
    })
  };
}
