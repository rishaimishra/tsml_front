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
declare var $: any;

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
  selectedFile2:any;
  fileName2:any;
  complainId: any;
  emailReceveId: any;
  receveEmailInfo: any;
  rcveEmail: any;
  interimFile: any;
  emailDetails:any;
  interimFileSize: boolean = false;
  fncReportFile:any;
  fncRepFileSize: boolean = false;
  cpaUpldFile:any;
  capaFileSize: boolean = false;
  fncSettUpldFile: any;
  fncSetFileSize: boolean = false;
  fncApprUpldFile:any;
  fncApprFileSize: boolean = false;
  mrktHeadUpldFile:any;
  merktHetFileSize: boolean = false;
  gmApprvlUpldFile:any;
  gmApprvlFileSize: boolean = false;
  fncialAprvalFile:any;
  fncialAprvalSize: boolean = false;
  disableIfMailrcv: boolean = false;



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

  onSelectFile2(event:any) {
    this.selectedFile2 = event.target.files[0];
    this.fileName2 = this.selectedFile2.name;
  }
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
    fileData.append('kam_com_file_2', this.selectedFile2);

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
        this.emailDetails = res.result;
        this.emailReceveId = res.result['com_manage_id'];
        this.rcveEmail = res.result['is_mail_resiv'];
        this.mailSendForm.controls['ka_remarks'].setValue(res.result['ka_remarks']);
      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
      }
    }, err => {
      console.log(err);
    })
  };

  allAttechmt(event: any) {
    const userId = localStorage.getItem('USER_ID');
    this.checkboxChecked = event.target.checked;
    if (this.checkboxChecked == true) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You have got the mail",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.checkboxChecked == true) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              text: 'Received Mail',
              showConfirmButton: false,
              timer: 1000
            })
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
        } else {
          this.checkboxChecked = false;
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

// Upload files
  uploadInterim(event:any) {
    this.interimFile = event.target.files[0];
    let file = event.target.files[0];
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   this.cerftificateUpl = reader.result;
    // };
    if (file.size >= 2083914) {
      this.interimFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.interimFileSize = false;
    }
  };

  uploadfncReport(event:any) {
    this.fncReportFile = event.target.files[0];
    let file = event.target.files[0];
    if (file.size >= 2083914) {
      this.fncRepFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.fncRepFileSize = false;
    }
  };

  capaFileupld(event:any) {
    this.cpaUpldFile = event.target.files[0];
    let file = event.target.files[0];
    if (file.size >= 2083914) {
      this.capaFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.capaFileSize = false;
    }
  };

  fncSettlmReprt(event:any) {
    this.fncSettUpldFile = event.target.files[0];
    let file = event.target.files[0];
    if (file.size >= 2083914) {
      this.fncSetFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.fncSetFileSize = false;
    }
  };

  fncApprUpld(event:any) {
    this.fncApprUpldFile = event.target.files[0];
    let file = event.target.files[0];
    if (file.size >= 2083914) {
      this.fncApprFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.fncApprFileSize = false;
    }
  };

  mrktHeadUpld(event:any) {
    this.mrktHeadUpldFile = event.target.files[0];
    let file = event.target.files[0];
    if (file.size >= 2083914) {
      this.merktHetFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.merktHetFileSize = false;
    }
  };

  gmApprvlUpld(event:any) {
    this.gmApprvlUpldFile = event.target.files[0];
    let file = event.target.files[0];
    if (file.size >= 2083914) {
      this.gmApprvlFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.gmApprvlFileSize = false;
    }
  };

  fncialAprvalUpld(event:any) {
    this.fncialAprvalFile = event.target.files[0];
    let file = event.target.files[0];
    if (file.size >= 2083914) {
      this.fncialAprvalSize = true;
      event.target.value = null;
      return;
    } else {
      this.fncialAprvalSize = false;
    }
  };

  submitComplaint() {
    this._spiner.show();
    const fileData = new FormData();
    let userId = localStorage.getItem('USER_ID');
    fileData.append('kam_id', userId);
    fileData.append('complain_id', this.complainId);
    fileData.append('po_no', this.compId);
    fileData.append('com_manage_id', this.emailReceveId);

    fileData.append('interim_report', this.interimFile);
    fileData.append('final_report', this.fncReportFile);
    fileData.append('capa', this.cpaUpldFile);
    fileData.append('financial_set_repo', this.fncSettUpldFile);
    fileData.append('sales_approval', this.fncApprUpldFile);
    fileData.append('marketing_head_approval', this.mrktHeadUpldFile);
    fileData.append('sr_gm_approval', this.gmApprvlUpldFile);
    fileData.append('financial_approval_op', this.fncialAprvalFile);

    this._complains.storeComplainFiles(fileData).subscribe((res: any) => {
    this._spiner.hide();
      if (res.status == 1) {
        Swal.fire({
          position: 'top',
          icon: 'success',
          text: 'File Uploaded successfully',
          showConfirmButton: false,
          timer: 1500
        })

        $("#myModal").hide();
        $('body').removeClass('modal-open');
        $(".modal-backdrop").removeClass("modal-backdrop show");
      }
      if (res.status == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Department name and email are required!'
        })
        return;
      }
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  }

  
}


