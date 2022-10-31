import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  showForgetPass: boolean = true;
  hideShowPass: boolean = false;
  forgetPassForm: FormGroup;
  email: any = '';

  constructor(private _auth: AuthService,
    private _fb: FormBuilder, private _toaster: ToastrService, private _spinner: NgxSpinnerService,
    private _router: Router) 
    { 
      this.forgetPassForm = this._fb.group({
        "email": [''],
        "password": [''],
        "password_confirm": ['']
      })
    }

  ngOnInit(): void {
  }

  resetPassword() {
    this._spinner.show();
    if (this.forgetPassForm.valid) {
      this._auth.resetPassByEmail(this.forgetPassForm.value).subscribe((res:any) => {
        console.log(res);
        if(res.message == 'Password changed successfully !!') {
          this._toaster.success(res.message);
          this._spinner.hide();
          this._router.navigate(['/login']);
        } else {
          this._spinner.hide();
        }
      }, err => {
        console.log(err);
        this._spinner.hide();
      })
    }
    }
  }

