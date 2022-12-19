import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';
import { environment } from 'src/environments/environment.prod'

@Component({
  selector: 'app-complains-list',
  templateUrl: './complains-list.component.html',
  styleUrls: ['./complains-list.component.scss']
})
export class ComplainsListComponent implements OnInit {
  
  userType: boolean;
  camplainsItems: any;
  customerFileArr:any = [];
  custFileDownload: boolean = false;
  kamFileDownload: boolean = false;
  custFileDowld:any;
  kamFileDownld:any;
  p: number = 1;
  baseFilePath = environment.filePath;

  
  constructor(private _complains: ComplainsService,
    private _spinner: NgxSpinnerService, private toaster: ToastrService,
    private _router: Router) { }

  ngOnInit(): void {
    this._spinner.show();
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      this.userType = false;

    } else {
      this.userType = true;

    }
    this.compalainsKmList();
  }
  userId:any = '';
  compalainsKmList() {
    let userRol = localStorage.getItem('USER_TYPE');
    if (userRol == 'Kam') {
      this.userId = "";
    } else {
      this.userId = localStorage.getItem('USER_ID');
    }
    let compListReq = {
      "user_id": this.userId
    }
    
    this._complains.getComplainsKamList(compListReq).subscribe((res:any) => {
      this._spinner.hide();
      if (res.status != 0 && res.message == 'success.') {
        this.camplainsItems = res.result;

      }
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/login']);
        this._spinner.hide();
      }
    }, err => {
      console.log(err)
    })
    this._spinner.hide();
  };

  goToreplyPage(complain_id:any) {
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      this.userType = false;
      this._router.navigate(['/complains/kam-reply',complain_id]);
    } else {
      this.userType = true;
      this._router.navigate(['/complains/complaints-reply',complain_id]);
    }
  };

  customerFileDownload(cusDownld:any) {
    this.custFileDowld = cusDownld.cust_com_file;
    this.kamFileDownload = false;
    this.custFileDownload = !this.custFileDownload;
  };

  kamDownload(camDownld:any) {
    this.kamFileDownld = camDownld.kam_com_file;
    this.custFileDownload = false;
    this.kamFileDownload = !this.kamFileDownload;
  }
}
