import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kam-reply',
  templateUrl: './kam-reply.component.html',
  styleUrls: ['./kam-reply.component.scss']
})
export class KamReplyComponent implements OnInit {

  userName:any;
  compInfo:any;
  showKamTextArea: boolean = false;
  remarkReply:any;


  constructor(private _route: ActivatedRoute,
    private _complains: ComplainsService, private _router: Router,
    private _spiner: NgxSpinnerService) { }

  ngOnInit(): void {
    const usrName:any = localStorage.getItem('USER_NAME');
    this._route.params.subscribe((param:any) => {
      this.userName = param.name;
      this.complainsReply();
    })
  }

  complainsReply() {
    this._spiner.show();
    let apiUrl = '/user/get-complain-list-kam?customer_name='+this.userName;
    this._complains.getMethod(apiUrl).subscribe((res:any) => {
      if (res.message == 'success.' && res.status == 1) {
        this._spiner.hide();
        this.compInfo = res.result;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/login']);
        this._spiner.hide();
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  reply() {
    this.showKamTextArea = !this.showKamTextArea;
  };

  submitReply(compId:any) {
    let replyReq = {
      "complain_id": compId,
      "kam_remarks": this.remarkReply,
    };
    console.log(replyReq);
    this._complains.replyComplains(replyReq).subscribe((res:any) => {
      console.log(res);
      if (res.status != 0) {
        this.complainsReply();
        this._spiner.hide();
        this.showKamTextArea == false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        this._spiner.hide();
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })

  }

}
