import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kam-reply',
  templateUrl: './kam-reply.component.html',
  styleUrls: ['./kam-reply.component.scss']
})
export class KamReplyComponent implements OnInit {

  compId:any;
  compInfo:any;
  showKamTextArea: boolean = false;
  remarkReply:any;
  closeChat: boolean = false;
  remarkAll:any = [];
  submitt: boolean = false;
  base64Image:any;
  imageUrl:any;


  constructor(private _route: ActivatedRoute,
    private _complains: ComplainsService, private _router: Router,
    private _spiner: NgxSpinnerService, private _toaster: ToastrService) { }

  ngOnInit(): void {
    const usrName:any = localStorage.getItem('USER_NAME');
    this._route.params.subscribe((param:any) => {
      this.compId = param.id;
      this.complainsReply();
    })
  }

  complainsReply() {
    this._spiner.show();
    let apiUrl = '/user/complain-details/'+this.compId;
    this._complains.getMethod(apiUrl).subscribe((res:any) => {
      if (res.message == 'success' && res.status == 1) {
        this._spiner.hide();
        this.compInfo = res.result;
        this.remarkAll = res.remarksData;
        this.imageUrl = this.remarkAll.file_url
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
    this.submitt = true;
    if(this.remarkReply == '') {
      this._toaster.error('','Remarks is required !');
      return;
    }
    let replyReq = {
      "complain_id": compId,
      "kam_remarks": this.remarkReply,
    };

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

  closeStatus (event:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to close this discussion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed && event.target.checked == true) {
        this.closeChat = true;

      } 
      if (event.target.checked == false) {
        this.closeChat = false
      }
    })
}

}
