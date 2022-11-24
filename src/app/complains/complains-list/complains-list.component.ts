import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplainsService } from 'src/app/service/complains.service';

@Component({
  selector: 'app-complains-list',
  templateUrl: './complains-list.component.html',
  styleUrls: ['./complains-list.component.scss']
})
export class ComplainsListComponent implements OnInit {
  userType: boolean;
  camplainsItems: any;

  
  constructor(private _complains: ComplainsService,
    private _spinner: NgxSpinnerService, private toaster: ToastrService,
    private _router: Router) { }

  ngOnInit(): void {
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
    this._spinner.show();
    this._complains.getComplainsKamList(compListReq).subscribe((res:any) => {
      if (res.status != 0 && res.message == 'success.') {
        this._spinner.hide();
        this.camplainsItems = res.result;
        console.log(this.camplainsItems);
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
  // userCompList () {
  //   this._complains.getComplainsKamList().subscribe((res:any) => {
  //     if (res.status != 0 && res.message == 'success.') {
  //       this._spinner.hide();
  //       this.camplainsItems = res.result;
  //       console.log(this.camplainsItems);
  //     }
  //     if (res.status == 'Token has Expired') {
  //       this._router.navigate(['/login']);
  //       this._spinner.hide();
  //     }
  //   }, err => {
  //     console.log(err)
  //   })
  //   this._spinner.hide();
  // }
  goToreplyPage(complain_id:any) {
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      this.userType = false;
      this._router.navigate(['/kam-reply',complain_id]);
    } else {
      this.userType = true;
      this._router.navigate(['/complains-reply',complain_id]);
    }
  }
}
