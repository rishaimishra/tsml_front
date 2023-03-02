import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { CustomValidators } from '../login/custom1Validator';
declare var $: any;
import {CryptoJSAesJson} from 'src/assets/js/cryptojs-aes-format.js';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  hideShowPass: boolean = false;
  disableLoginBtn: boolean = false;
  hideLogin: boolean = true;
  forgetEmail: any;
  token: string | undefined;
  disableLogin: boolean = true;

  public showPassword: boolean;
  public showPasswordOnPress: boolean;

  constructor(private _fb: FormBuilder, private _toster: ToastrService,
    private _auth: AuthService, private _router: Router, private _spinner: NgxSpinnerService) {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      logotp: ['', Validators.minLength(6)]
    })
    CustomValidators.mustMatch('password', 'password_confirm') // insert here
    this.token = undefined;

  }

  get f() {
    return this.loginForm.controls;
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

  // goToForgetPass() {
  //   this.hideLogin = false;
  //   this.hideShowPass = true;
  // };

  forgetPassword() {
    if (this.forgetEmail == null || this.forgetEmail == undefined) {
      this._toster.error('Email is required', 'Sorry!');
      return;
    }
    this._spinner.show();
    let forget = {
      "email": this.forgetEmail
    }
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(forget, passwordd);

    this._auth.forgetPass(encryptedd).subscribe((res: any) => {
      this._spinner.hide();
      if (res.status == 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'OTP has been sent to your registered mail id !',
        })
        this._router.navigate(['/auth/forget-password'])
      }
    }, err => {
      console.log(err);
      this._spinner.hide()
    })
  };

  submitLogin(form: NgForm) {
    this.submitted = true;
    this.send(form);
    let captchaToken = `Token [${this.token}] generated`;
    let email = this.loginForm.value['email'];
    if (this.token == undefined || captchaToken == undefined) {
      return;
    }
    else if (this.loginForm.invalid) {
      return;
    }
    else if (this.loginForm.value['logotp'] == "") {
      this._toster.error('OTP is required', 'Sorry!');
      return;
    }
    let loginForm = this.loginForm.value;
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(loginForm, passwordd);

    this._spinner.show();
    this._auth.login(encryptedd).subscribe((res: any) => {
      this._spinner.hide();
      if (res.success == true) {
        localStorage.setItem('tokenUrl', res.token);
        localStorage.setItem('USER_NAME', res.data.user_name);
        localStorage.setItem('USER_ID', res.data.user_id);
        localStorage.setItem('USER_TYPE', res.data.user_type);
        localStorage.setItem('USER_EMAIL', email);

        if (res.data['user_type'] == 'Kam') {
          this._router.navigate(['/dashboard/kam-dashboard']);
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Welcome to CAM Dashboard',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else if (res.data['user_type'] == 'Sales') {
          this._router.navigate(['/dashboard/sales-dashboard']);
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Welcome to Sales Planning Dashboard',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else if (res.data['user_type'] == 'C') {
          this._router.navigate(['/dashboard/customer-dashboard']);
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Welcome to Customer Dashboard',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else if (res.data['user_type'] == 'SM') {
          this._router.navigate(['/dashboard/manager-dashboard']);
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Welcome to Sales Manager Dashboard',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else if (res.data['user_type'] == 'PLANT') {
          this._router.navigate(['/dashboard/plant-dashboard']);
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Welcome to Plant Dashboard',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else if (res.data['user_type'] == 'OPT') {
          this._router.navigate(['/dashboard/opt-dashboard']);
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Welcome to OPT dashboard',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }

      if (res.success == false && res.message == 'You are already logged in, please logout from there') {
        Swal.fire({
          title: 'Sorry',
          text: "You are already logged in, please logout!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Logout !'
        }).then((result) => {
          if (result.isConfirmed) {
            this.forceLogout();
          }
        })
        return;
      }
      // else if (res.success == false && res.message == 'Password expired.') {
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Sorry !',
      //     text: res.message,
      //   })
      //   this._router.navigate(['/auth/reset-password']);
      //   return;
      // }

      else if (res.success == false && res.result?.user_status == null) {
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: res.message,
        })
        return;
      }
      else if (res.success == false && res.message == 'Invalid OTP please check') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message,
        })
        return;
      }

      else if (res.success == false && res.result['user_status'] == 2) {
        this.disableLoginBtn = true;
        let userEmail = this.loginForm.value['email'];
        localStorage.setItem('USER_EMAIL', userEmail);
        Swal.fire({
          icon: 'error',
          title: 'Sorry !',
          text: res.message,
        })
        return;
      } else {
        this.disableLoginBtn = false;
      }
    }, error => {
      console.log(error);
      this._spinner.hide();
    })

  };

  forceLogout() {
    let userEmail = this.loginForm.value['email'];
    if (userEmail == null || userEmail == "") {
      return;
    }
    let reqParams = {
      "email": userEmail
    }
    this._auth.forceLogOut(reqParams).subscribe((res: any) => {
      console.log(res);
    })
  };

  backToLogin() {
    this.hideShowPass = false;
    this.hideLogin = true;
  };

  getOtpLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    let params = {
      "email": this.loginForm.value['email'],
      "password": this.loginForm.value['password']
    }
    // Encrypt
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(params, passwordd);

    this._spinner.show();
    this._auth.getOtpLog(encryptedd).subscribe((res: any) => {
      this._spinner.hide();

      if (res.status == 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message,
        })
        this.disableLogin = false;
      }
      else if (res.success == false && res.status != 2 && res.result != 1) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message,
        })
      }
      else if (res.status == 2) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message,
        })
        this._router.navigate(['/auth/reset-password']);
      }
      else if (res.result == 1) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message,
        })
        this._router.navigate(['/auth/reset-password']);
      }
    }, err => {
      console.log(err);
      this._spinner.hide()
    })

  }
}
