import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complains-reply',
  templateUrl: './complains-reply.component.html',
  styleUrls: ['./complains-reply.component.scss']
})
export class ComplainsReplyComponent implements OnInit {
  compId:any;
  submitt: boolean = false;
  compInfo:any;
  showKamTextArea: boolean = false;
  remarkReply:any;
  closeChat: boolean = false;
  remarkAll:any = [];
  selectedFile: File;
  fileName:any;


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
  onSelectFile(event:any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name;
  };

  complainsReply() {
    this._spiner.show();
    let apiUrl = '/user/complain-details-kam/'+ this.compId;
    this._complains.getMethod(apiUrl).subscribe((res:any) => {
      this._spiner.hide();
      if (res.message == 'success' && res.status == 1) {
        this.compInfo = res.result;
        this.remarkAll = res.remarksData;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/login']);
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
    const fileData = new FormData();
    if(this.remarkReply == undefined) {
      this._toaster.error('','Remarks is required !');
      return;
    } else {
      this._spiner.show();
    this.submitt = true;

    fileData.append('complain_id', compId);
    fileData.append('customer_remarks', this.remarkReply);
    fileData.append('cust_complain_file', this.selectedFile);

    this._complains.replyComplains(fileData).subscribe((res:any) => {
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
    
  };

  closeStatus (compId:any) {
    let apiUrl = '/user/closed-remarks/' +  compId;
    this._complains.getMethod(apiUrl).subscribe((res:any) => {
      Swal.fire(
        'Closed!',
        'Discussion has been closed!',
        'success'
      )
    })
  }
}
