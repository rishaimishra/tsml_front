import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/service/sales.service';
import Swal from 'sweetalert2';
declare var $: any;


@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.scss']
})
export class UpdateInfoComponent implements OnInit {
  scInfoItems:any = [];
  p: number = 1;


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
        this.scInfoItems = res.result;
      }
    })
  }

  updateScSo(id:any) {
    let scNum = $('#scNumber'+id).val();
    let soNum = $('#soNumber'+id).val();
    let params = {
      "id": id,
      "sc_no": scNum,
      "ordr_no": soNum
    }
    if(scNum == "") {
      this._toaster.error('Contract No. is required', 'Oops!');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this._spiner.show();
        this._sales.updateSc(params).subscribe((res:any) => {
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
        })
      }
    })
  }
}
