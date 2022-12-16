import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-complains-reply',
  templateUrl: './complains-reply.component.html',
  styleUrls: ['./complains-reply.component.scss']
})
export class ComplainsReplyComponent implements OnInit {
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;
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
        this._router.navigate(['/auth/login']);
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  reply() {
    this.showKamTextArea = !this.showKamTextArea;
  };
  closeStatus (event:any) {
    this.closeChat = event.target.checked;
  };

  submitReply(compId:any) {
    const fileData = new FormData();
    this._spiner.show();
    if(this.remarkReply == undefined) {
      this._toaster.error('','Remarks is required !');
      return;
    } else {
    this.submitt = true;
    fileData.append('complain_id', compId);
    fileData.append('customer_remarks', this.remarkReply);
    fileData.append('cust_complain_file', this.selectedFile);

    this._complains.replyComplains(fileData).subscribe((res:any) => {
      // this._spiner.hide();
      if (res.status != 0) {
        this.complainsReply();
        this.showKamTextArea == false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        });

      }
      if (this.closeChat == true) {
        let apiUrl = '/user/closed-remarks/' +  compId;
        this._complains.getMethod(apiUrl).subscribe((res:any) => {
          this._spiner.hide();
          Swal.fire(
            'Closed!',
            'Discussion has been closed!',
            'success'
          )
          this._router.navigate(['/complains/complaints-list']);
        })
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })

    }
  };
  downloadAsPDF() {
    const doc = new jsPDF();
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();
  };
}
