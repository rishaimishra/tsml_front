import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { CustomValidators } from './customValidator';

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




  constructor(private _fb: FormBuilder, 
    private _auth: AuthService, private _spiner: NgxSpinnerService,
    private _router: Router) 
  { 
    this.resetPassForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
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
    this._spiner.show();
    this._auth.passwordReset(this.resetPassForm.value).subscribe((res:any) => {
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
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  }
}
