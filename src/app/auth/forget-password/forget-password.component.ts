import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { CustomValidators } from './customValidator';
import {CryptoJSAesJson} from 'src/assets/js/cryptojs-aes-format.js';
declare var $: any;
import randomString from 'randomstring';
import { Directive, HostListener } from '@angular/core';




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
  showFields: boolean = false;
  token: string|undefined;

  public showPassword: boolean;
  public showPasswordOnPress: boolean;

  public showPassword1: boolean;
  public showPasswordOnPress1: boolean;

  generatedCaptchaValue: any;
  captchaValue = "";

  constructor(private _auth: AuthService,
    private _fb: FormBuilder, private _toaster: ToastrService, 
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _toster: ToastrService) 
    {
    this.forgetPassForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      password_confirm: ['', [Validators.required, Validators.minLength(6)]],
      capthaValueEntered: ['']
    })

    CustomValidators.mustMatch('password', 'password_confirm') // insert here
    this.token = undefined;
  }
  get f() {
    return this.forgetPassForm.controls;
  }
  ngOnInit(): void {
    this.generateCaptha()
  }
  generateCaptha() {
    var result = randomString.generate(6)
    console.log(result);
    this.generatedCaptchaValue = result;
  }

  /* send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }
  }; */
  
  forgotPassword() {
    this.submitted = true;
    /* this.send(form);
    let captchaToken = `Token [${this.token}] generated`;
    if(this.token == undefined || captchaToken == undefined) {
      return;
    } */
    if (this.forgetPassForm.invalid) {
      return;
    }
    if (this.generatedCaptchaValue !== this.forgetPassForm.value['capthaValueEntered']) {
      Swal.fire({
        icon: 'error',
        title: 'Sorry !',
        text: 'Invalid Captcha',
      })
      return;
    }
    let forgetValue = this.forgetPassForm.value;
    let password = '123456';
    let encrypted = CryptoJSAesJson.encrypt(forgetValue, password);
    this._spinner.show();
    this._auth.submitForgetPass(encrypted).subscribe((res: any) => {
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
      else if (res.error?.validation?.password_confirm?.length > 0 && res.error?.validation?.password_confirm != undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: 'New password and confirm password must match',
        })
        this._spinner.hide();
      }
      else if (res.error?.validation?.otp?.length > 0 && res.error?.validation.otp != undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: res.error?.validation.otp[0],
        })
        this._spinner.hide();
      }

      else if (res.error.message == "Invalid OTP or email please check !!") {
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: res.error.message,
        })
        this._spinner.hide();
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
    })
  };

  getOtp() {
    let email = $('#emailfield').val();
    if (email == '' || email == undefined) {
      this._toster.error('Email is required !', 'Sorry!');
      return;
    }
    let forget = {
      "email": email
    }

    // return;
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(forget, passwordd);
    
    this._spinner.show();
    this._auth.forgetPass(encryptedd).subscribe((res: any) => {
      this._spinner.hide();
      if (res.status == 1) {
        this.showFields = true;
        $('#otpdSDisable').prop('disabled', true);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'OTP has been sent to your registered mail id !',
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Sorry',
          text: res.error['message'],
        })
      }
    }, err => {
      console.log(err);
      this._spinner.hide()
    })
  };

}
