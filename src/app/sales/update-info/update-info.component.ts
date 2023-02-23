import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';
declare var $: any;
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';


@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.scss']
})
export class UpdateInfoComponent implements OnInit {
  scInfoItems:any = [];
  p: number = 1;
  sc_id: any;
  scNum: any;


  constructor(private _sales: SalesService, private _spiner: NgxSpinnerService,
    private _toaster: ToastrService) { }

  ngOnInit(): void {
    this.getScList();
  }

  getScList() {
    this._spiner.show();
    this._sales.getScInfoList().subscribe((res:any) => {
      this._spiner.hide();
      if(res.message == 'success') {
        let password = '123456'
        let result = CryptoJSAesJson.decrypt(res.result, password)
        this.scInfoItems = result;
        console.log(result);
      }
    })
  };

  updateScSo(id:any) {
    let scNum = $('#scNumber'+id).val();
    let params = {
      "id": id,
      "sc_no": scNum,
      "ordr_no": null,
      "finance_no": null,
      "payment_proc": null
    }
    if(scNum == "") {
      this._toaster.error('Contract No. is required', 'Oops!');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to update !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._spiner.show();
        let passwordd = '123456';
        let encryptedd = CryptoJSAesJson.encrypt(params, passwordd)

        this._sales.updateSc(encryptedd).subscribe((res:any) => {
          this._spiner.hide();
          if(res.status == 1 && res.message == 'success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: '',
              showConfirmButton: false,
              timer: 1500
            })
            this.getScList();
          }
          else if(res.status == 1 && res.message =="Not Updated") {
            Swal.fire({
              icon: 'warning',
              title: 'Sorry',
              text: res.result,
            })
            return;
          }
        }, err => {
          console.log(err);
        })
      }
    })
  };

  openModel(id:any,sc_no:any,ordr_no:any) {
    $('#soNumber').val(ordr_no);

    if(ordr_no != null) {
      $('#soNumber').prop('readonly', true);
    } else {
      $('#soNumber').prop('readonly', false);
    }

    this.sc_id = id;
    this.scNum = sc_no;
  };

  updateSO() {
    let soNum = $('#soNumber').val();
    let payment = $('#payment_pr').val();
    let financial = $('#financial_d').val();

    if(soNum == '' || soNum == null) {
      this._toaster.error('SO number is required','Sorry !');
      return;
    }
    let reqParams = {
      "id": this.sc_id,
      "sc_no": this.scNum,
      "ordr_no": soNum ? soNum: null,
      "finance_no": financial ? financial: null,
      "payment_proc": payment ? payment: null
    }
    console.log(reqParams);

    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(reqParams, passwordd);

    this._spiner.show();
    this._sales.updateSc(encryptedd).subscribe((res:any) => {
      this._spiner.hide();
    if(res.message == 'success') {
      this.getScList();
      Swal.fire({
        position: 'center',
        icon: 'success',
        text: '',
        showConfirmButton: false,
        timer: 1500
      })

      $("#soUpdateModel").hide();
      $('body').removeClass('modal-open');
      $(".modal-backdrop").removeClass("modal-backdrop show");
    }

    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  }
}
