import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private _fb: FormBuilder, private _toster: ToastrService,
    private _auth: AuthService, private _router: Router, private _spinner: NgxSpinnerService) {
    this.loginForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  submitLogin() {
    this._spinner.show();
    if (!this.loginForm.invalid) {
      this._auth.login(this.loginForm.value).subscribe((res: any) => {
        if (res.success == true) {
          this._toster.success('Login Successfully', 'Welcome');
          localStorage.setItem('tokenUrl',res.token);
          
          this._spinner.hide();
          this._router.navigate(['/']);
        } else {
          this._toster.error(res.success.message);
          this._spinner.hide();
        }
      }, error => {
        console.log(error);
        this._toster.error('Invalid Email or Password');
          this._spinner.hide();
      })
    } else {
      this._toster.error('Invalid email or password !');
      return;
    }
  }
}
