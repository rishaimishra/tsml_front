import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { CustomValidators } from '../login/custom1Validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  hideShowPass: boolean = false;
  hideLogin: boolean = true;
  forgetEmail:any;

  constructor(private _fb: FormBuilder, private _toster: ToastrService,
    private _auth: AuthService, private _router: Router, private _spinner: NgxSpinnerService) {
    this.loginForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
    CustomValidators.mustMatch('password', 'password_confirm') // insert here
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {

  }

  goToForgetPass() {
    this.hideLogin = false;
    this.hideShowPass = true;
  };
  forgetPassword() {
    this._spinner.show();
    let forget = {
      "email": this.forgetEmail
    }
    this._auth.forgetPass(forget).subscribe((res:any) => {
      this._spinner.hide();
      if (res.status == 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'OTP has been sent to your registered mail id !',
        })
        this._router.navigate(['/auth/forget-password'])
      }
    })
  };

  submitLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) { 
      return;
    }
    else {
      this._spinner.show();
      this._auth.login(this.loginForm.value).subscribe((res: any) => {
        this._spinner.hide();
        if (res.success == true) {
          
          localStorage.setItem('tokenUrl',res.token);
          localStorage.setItem('USER_NAME',res.data.user_name);
          localStorage.setItem('USER_ID',res.data.user_id);
          localStorage.setItem('USER_TYPE',res.data.user_type);
          
          if(res.data['user_type'] == 'Kam') {
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
      }, error => {
        console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid Email or Password!',
          })
          this._spinner.hide();
      })
    }
  };

  backToLogin() {
    this.hideShowPass = false;
    this.hideLogin = true;
  }
}
