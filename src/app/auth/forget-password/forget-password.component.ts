import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private _auth: AuthService,
    private _fb: FormBuilder, private _toaster: ToastrService, private _spinner: NgxSpinnerService,
    private _router: Router) 
    {
    this.forgetPassForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required, Validators.minLength(6)]]
    })

    CustomValidators.mustMatch('password', 'password_confirm') // insert here
  }
  get f() {
    return this.forgetPassForm.controls;
  }
  ngOnInit(): void {
  }

  resetPassword() {
    this._spinner.show();
    this.submitted = true;
    if (this.forgetPassForm.invalid) {
      this._spinner.hide();
      return;
    }
    if (this.forgetPassForm.valid) {
      this._auth.resetPassByEmail(this.forgetPassForm.value).subscribe((res:any) => {
        if (!this.forgetPassForm.invalid && res.message == 'Password changed successfully !!' && !res.error) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Password changed successfully !!',
            showConfirmButton: false,
            timer: 1500
          })
          this._spinner.hide();
          this._router.navigate(['/login']);
        } 
          if(res.error.message == 'Email address not found !!') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.error.message
              // footer: '<a href="">Why do I have this issue?</a>'
            })
          } 
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.error.validation.password_confirm,
              // footer: '<a href="">Why do I have this issue?</a>'
            })
          }
          this._spinner.hide();
        
      })
}}

}
