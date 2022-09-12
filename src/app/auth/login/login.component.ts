import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private _auth: AuthService, private _router: Router) 
  { 
    this.loginForm = this._fb.group({
      email: ['', Validators.required],
      password: ['',Validators.required]
    })
  }

  ngOnInit(): void {
  }

  submitLogin() {
    if(!this.loginForm.invalid) {
      this._auth.login(this.loginForm.value).subscribe(res => {
        console.log(res);
      }, error => {
        console.log(error);
      })
      console.log(this.loginForm.value);
    }
  }
}
