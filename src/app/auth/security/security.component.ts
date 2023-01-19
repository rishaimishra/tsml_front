import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  securityForm: FormGroup;
  questions:any = [];

  constructor(private _fb: FormBuilder,
    private _auth: AuthService) 
  { 
    this.securityForm = this._fb.group({
      securityone: [''],
      answoreone: [''],
      securitytwo: [''],
      answoretwo: ['']
    })
  }

  ngOnInit(): void {
    this.getQuestions();
  }


  getQuestions() {
    this._auth.getSecurityQue().subscribe((res:any) => {
      console.log(res);
      if(res.message == 'success.') {
        this.questions = res.result;
      }
    })
  };

  saveForm() {
    let value = this.securityForm.value;
    if (value.securityone == value.securitytwo) {
      alert("Qouestion should not be same !");
    }
  }
}
