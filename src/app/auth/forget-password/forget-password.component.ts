import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { CustomValidators } from './customValidator';

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
  submitted: boolean = false;
  token: string|undefined;

  constructor(private _auth: AuthService,
    private _fb: FormBuilder, private _toaster: ToastrService, private _spinner: NgxSpinnerService,
    private _router: Router) {
    this.forgetPassForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      password_confirm: ['', [Validators.required, Validators.minLength(6)]]
    })

    CustomValidators.mustMatch('password', 'password_confirm') // insert here
    this.token = undefined;
  }
  get f() {
    return this.forgetPassForm.controls;
  }
  ngOnInit(): void {
  }

  send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

  };
  
  forgotPassword(form: NgForm) {
    this.submitted = true;
    this.send(form);
    let captchaToken = `Token [${this.token}] generated`;
    if(this.token == undefined || captchaToken == undefined) {
      return;
    }
    // if (this.forgetPassForm.invalid) {
    //   return;
    // }

    this._spinner.show();
    this._auth.submitForgetPass(this.forgetPassForm.value).subscribe((res: any) => {
      this._spinner.hide();
      if (res.status == 1) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Password changed successfully !!',
          showConfirmButton: false,
          timer: 1500
        })
        this._spinner.hide();
        this._router.navigate(['/auth/login']);
      }
      else if (res.error.validation.password_confirm?.length > 0 && res.error.validation.password_confirm != undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: 'New password and confirm password must match',
        })
        this._spinner.hide();
      }
      else if (res.error.validation.otp?.length > 0 && res.error.validation.otp != undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: res.error.validation.otp[0],
        })
        this._spinner.hide();
      }

    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  };

}
