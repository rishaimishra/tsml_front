import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  showForgetPass: boolean = false;
  hideShowPass: boolean = true;
  email: any = '';

  constructor(private _auth: AuthService) { }

  ngOnInit(): void {
  }

  resetPassword() {
    if(this.email != '') {
      let emailReq = {
        "email": this.email
      }
      this._auth.resetPassByEmail(emailReq).subscribe((res:any) => {
        console.log(res);
      }, err => {
        console.log(err);
      })
    }
  }
}
