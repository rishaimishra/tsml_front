import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { CustomValidators } from './customValidator';
declare var $: any;
import {CryptoJSAesJson} from 'src/assets/js/cryptojs-aes-format.js';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPassForm: FormGroup;
  submitt: boolean = false;
  email: any = '';
  token: string|undefined;
  recevedOtp: boolean = false;
  errorMsg: boolean = true;
  hide = true;

  public showPassword: boolean;
  public showPasswordOnPress: boolean;

  public showPassword1: boolean;
  public showPasswordOnPress1: boolean;

  public showPassword2: boolean;
  public showPasswordOnPress2: boolean;

  constructor(private _fb: FormBuilder, 
    private _auth: AuthService, private _spiner: NgxSpinnerService,
    private _router: Router, private _toaster: ToastrService) 
  { 
    this.resetPassForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6)]],
      old_pass: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(10)]],
      password_confirm: ['', [Validators.required, Validators.minLength(10)]]
    })

    CustomValidators.mustMatch('password', 'password_confirm') // insert here
    this.token = undefined;
  }

  get f() {
    return this.resetPassForm.controls;
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

  getOtp() {
    let email = $('#resetEmail').val();
    if(email == null || email == "") {
      this._toaster.error('Email is required','Sorry !');
      return;
    }
    let params = {
      "email": email
    }

    let password = '123456';
    let encrypted = CryptoJSAesJson.encrypt(params, password);

    this._spiner.show();
    this._auth.resetOtp(encrypted).subscribe((res:any) => {
      this._spiner.hide();
      if(res.status == 1) {
        this.recevedOtp = true;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'OTP has been sent to your registered email - '+email,
        })
      }
    }, err => {
      console.log(err);
      this._spiner.hide()
    })
  };

  sabmitResetPass(form: NgForm) {
    this.submitt = true;
    this.send(form);
    let captchaToken = `Token [${this.token}] generated`;
    if(this.token == undefined || captchaToken == undefined) {
      return;
    }
    let fb = this.resetPassForm.value;
    if(fb.password !== fb.password_confirm) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Password must match!',
      })
      return;
    }
    else if(this.resetPassForm.invalid) {
      return;
    } 
    let resetValue = this.resetPassForm.value;
    let password = '123456';
    let encrypted = CryptoJSAesJson.encrypt(resetValue, password);

    this._spiner.show();
    this._auth.passwordReset(encrypted).subscribe((res:any) => {
      this._spiner.hide();

      if(res.status == 1) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        })
        this._router.navigate(['/auth/login'])
      }
      else if ( res.status == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: res.message,
        })
      }
      else if(res.error['message'] != null || res.error['message'] != "") {
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: 'Please enter your valid 6 digit OTP',
        })
      }

    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  }

  passwordCheck(event:any) {
   let pass = event.target.value;
    var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
    this.errorMsg = pattern.test(pass);
    if(pattern.test(pass)){
        return true;
    } else{
        return false;
    }
  }
}
