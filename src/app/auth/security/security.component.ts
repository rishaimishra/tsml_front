import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  securityForm: FormGroup;
  questions:any = [];
  submit: boolean = false;

  constructor(private _fb: FormBuilder,
    private _auth: AuthService, private _spinner: NgxSpinnerService,
    private _router: Router) 
  { 
    this.securityForm = this._fb.group({
      eamil: [''],
      securityone: ['', Validators.required],
      answoreone: ['', Validators.required, Validators.maxLength(20)],
      securitytwo: ['', Validators.required],
      answoretwo: ['', Validators.required, Validators.maxLength(20)]
    })
  }
  get f() { return this.securityForm.controls; }

  ngOnInit(): void {
    this.getQuestions();
  }


  getQuestions() {
    this._spinner.show();
    this._auth.getSecurityQue().subscribe((res:any) => {
    this._spinner.hide();
      if(res.message == 'success.') {
        this.questions = res.result;
      }
    })
  };

  saveForm() {
    this.submit = true;
    let value = this.securityForm.value;
    let email = localStorage.getItem('USER_EMAIL');

    if (value.securityone == value.securitytwo) {
      Swal.fire('Question selected should not match !');
      return;
    }
    if (this.securityForm.invalid) {
      return;
    }
    let securityParam = [{
      "email": email,
      "securityone": value.securityone,
      "answoreone": value.answoreone
    },
    {
      "email": email,
      "securityone": value.securitytwo,
      "answoreone": value.answoretwo
    }]
    // this._spinner.show();
    this._auth.matchSecurityQu(securityParam).subscribe((res:any) => {
      if (res.status == 1 && res.result == true) {
        
        let reqParam = {
          "email": email
        }
        this._auth.emailSecurityQu(reqParam).subscribe((res:any) => {
          if(res.status == 1) {
            this._spinner.hide();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'We have sent a new password to your registered mail address!',
            })

            this._router.navigate(['/auth/login']);
          }
        })
      }
    })
  }
}
