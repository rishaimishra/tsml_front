import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';
import {environment} from 'src/environments/environment'

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-kam-reply',
  templateUrl: './kam-reply.component.html',
  styleUrls: ['./kam-reply.component.scss']
})
export class KamReplyComponent implements OnInit {
  @ViewChild('pdfTable') pdfTable: ElementRef;

  compId:any;
  compInfo:any;
  showKamTextArea: boolean = false;
  remarkReply:any;
  closeChat: boolean = false;
  remarkAll:any = [];
  submitt: boolean = false;
  base64Image:any;
  imageUrl:any;
  downloadFile = environment.apiEndpointBase;
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
    let apiUrl = '/user/complain-details-kam/'+this.compId;
    this._complains.getMethod(apiUrl).subscribe((res:any) => {
      this._spiner.hide();
      if (res.message == 'success' && res.status == 1) {
        this._spiner.hide();
        this.compInfo = res.result;
        this.remarkAll = res.remarksData;
        this.imageUrl = this.compInfo.file_url;
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

  closeStatus (event:any) {
    this.closeChat = event.target.checked;
  };
  
  submitReply(compId:any) {
    const fileData = new FormData();
    this._spiner.show();
    this.submitt = true;
    if(this.remarkReply == undefined) {
      this._toaster.error('','Remarks is required !');
      return;
    }
    fileData.append('complain_id', compId);
    fileData.append('kam_remarks', this.remarkReply);
    fileData.append('kam_complain_file', this.selectedFile);

    this._complains.replyComplains(fileData).subscribe((res:any) => {
      this._spiner.hide();
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
      } else {
        this._spiner.hide();
      };

      if (this.closeChat == true) {
        let apiUrl = '/user/closed-remarks/' +  compId;
        this._complains.getMethod(apiUrl).subscribe((res:any) => {
          this._spiner.hide();
          Swal.fire(
            'Closed!',
            'Discussion has been closed!',
            'success'
          )
        })
        this._router.navigate(['/complains-list']);
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

   downloadAsPDF() {
    const doc = new jsPDF();
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open(); 
  }
}


