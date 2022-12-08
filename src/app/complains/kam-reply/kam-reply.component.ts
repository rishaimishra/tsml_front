import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { ComplainsService } from 'src/app/service/complains.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment'

import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-kam-reply',
  templateUrl: './kam-reply.component.html',
  styleUrls: ['./kam-reply.component.scss']
})
export class KamReplyComponent implements OnInit {
  // @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  compId: any;
  compInfo: any;
  showKamTextArea: boolean = false;
  remarkReply: any;
  closeChat: boolean = false;
  remarkAll: any = [];
  submitt: boolean = false;
  base64Image: any;
  imageUrl: any;
  downloadFile = environment.apiEndpointBase;
  selectedFile: File;
  fileName: any;

  mailSendForm: FormGroup;
  uploadAttchmntForm: FormGroup;
  showCpaUpld: boolean = false;
  showFinancUpld: boolean = false;
  checkboxChecked: boolean = false;
  departmentName: any = [];
  departmentMail: any = [];
  complainId: any;
  emailReceveId: any;
  receveEmailInfo: any;
  rcveEmail: any;
  interimFile: any;


  constructor(private _route: ActivatedRoute,
    private _complains: ComplainsService, private _router: Router,
    private _spiner: NgxSpinnerService, private _toaster: ToastrService,
    private _fb: FormBuilder) {
    this.mailSendForm = this._fb.group({
      depa_id: [''],
      r_mail: [''],
      po_no: [''],
      kam_id: [''],
      complain_id: [''],
      ka_remarks: ['']
    })

    this.uploadAttchmntForm = this._fb.group({
        com_manage_id: [''],
        kam_id: [''],
        complain_id: [''],
        po_no: [''],
        interim_report: [''],
        final_report: [''],
        capa: [''],
        financial_set_repo: [''],
        sales_approval: [''],
        marketing_head_approval: [''],
        sr_gm_approval: [''],
        financial_approval_op: ['']
    })
  }

  ngOnInit(): void {
    this._route.params.subscribe((param: any) => {
      this.compId = param.id;
      this.complainsReply();
      this.department();
    })
  }

  onSelectFile(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name;
  };

  complainsReply() {
    this._spiner.show();
    let apiUrl = '/user/complain-details-kam/' + this.compId;
    this._complains.getMethod(apiUrl).subscribe((res: any) => {
      this._spiner.hide();
      if (res.message == 'success' && res.status == 1) {
        this._spiner.hide();
        this.compInfo = res.result;
        this.remarkAll = res.remarksData;
        this.complainId = this.compInfo['complain_id'];
        this.imageUrl = this.compInfo.file_url;
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
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

  closeStatus(event: any) {
    this.closeChat = event.target.checked;
  };

  submitReply(compId: any) {
    const fileData = new FormData();
    this._spiner.show();
    this.submitt = true;
    if (this.remarkReply == undefined) {
      this._toaster.error('', 'Remarks is required !');
      return;
    }
    let camUserId = localStorage.getItem('USER_ID');
    fileData.append('complain_id', compId);
    fileData.append('kam_remarks', this.remarkReply);
    fileData.append('kam_id', camUserId);
    fileData.append('kam_complain_file', this.selectedFile);

    this._complains.replyComplains(fileData).subscribe((res: any) => {
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
        let apiUrl = '/user/closed-remarks/' + compId;
        this._complains.getMethod(apiUrl).subscribe((res: any) => {
          this._spiner.hide();
          Swal.fire(
            'Closed!',
            'Discussion has been closed!',
            'success'
          )
        })
        this._router.navigate(['/complains/complaints-list']);
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  capaSelect(event: any) {
    let capaValue = event.target.value;
    if (capaValue == 'Yes') {
      this.showCpaUpld = true;
    } else {
      this.showCpaUpld = false;
    }
  };

  selecFinanc(event: any) {
    let financVal = event.target.value;
    if (financVal == 'Yes') {
      this.showFinancUpld = true;
    } else {
      this.showFinancUpld = false;
    }
  };
  showModel() {
    const userId = localStorage.getItem('USER_ID');
    let openModelreq = {
      "complain_id": this.complainId,
      "kam_id": userId,
      "po_no": this.compId
    }
    this._complains.openModelSubmit(openModelreq).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'Success') {
        this.emailReceveId = res.result['com_manage_id'];
        this.rcveEmail = res.result['is_mail_resiv'];
        if (res.result['is_mail_resiv'] == 1) {
          this.checkboxChecked == true;
          console.log('hello');
        }
      }
    })
  };

  allAttechmt(event: any) {
    const userId = localStorage.getItem('USER_ID');
    this.checkboxChecked = event.target.checked;
    if (this.checkboxChecked == true) {
      let checkReq = {
        "mcom_id": this.emailReceveId,
        "kam_id": userId,
        "po_no": this.compId
      }
      this._complains.emailReceve(checkReq).subscribe((res: any) => {
        if (res.status == 1 && res.message == 'Success') {
          this.receveEmailInfo = res.result;
        }
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

  department() {
    this._spiner.show();
    this._complains.getDepartment().subscribe((res: any) => {
      this._spiner.hide();
      if (res.status == 1 && res.message == 'Success') {
        this.departmentName = res.result;
        console.log(this.departmentName);
      }
    })
  };
  selectDprt(event: any) {
    let dprtId = event.target.value;
    let deprtMail = {
      "depa_id": dprtId
    }
    this._complains.getDeprtEmail(deprtMail).subscribe((res: any) => {
      if (res.status == 1 && res.message == 'Success') {
        this.departmentMail = res.result;
      }
    })
  };

  sendMail() {
    if (this.mailSendForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
      })
      return;
    }
    this._spiner.show();
    const userId = localStorage.getItem('USER_ID');
    this.mailSendForm.value['po_no'] = this.compId;
    this.mailSendForm.value['kam_id'] = userId;
    this.mailSendForm.value['complain_id'] = this.complainId;
    this._complains.sendEmail(this.mailSendForm.value).subscribe((res: any) => {
      this._spiner.hide();
      if (res.status != 0 && res.message != 'error') {
        console.log(res.result);
        Swal.fire(
          'Success',
          'Complaint Mail Sent Successfully',
          'success'
        )
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  };

  uploadInterim(event:any) {
    this.interimFile = event.target.files[0];
    console.log(this.interimFile);
  };

}


