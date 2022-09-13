
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  chooseProduct: any = [];
  chooseProductSize: any = [];
  registerForm: FormGroup;
  submitted = false;

  mobileTab: boolean = true;
  ekycTab: boolean = false;
  addressTab: boolean = false;
  uploadTab: boolean = false;

  mobileNumber: any = '';
  verifyingOpt: any;
  verifyOtp: any;
  userType: any;
  fileToUpload: File | undefined;
  imageUrl: string = '';
  businessType: any;
  addressProfe: any;
  selectedFile: any;
  cancelCheckBook: any;
  mobile: any;
  haveOtp: boolean = true;
  invildForm: boolean = true;

  constructor(private _router: Router, private _fb: FormBuilder,
    private _auth: AuthService,private toastr: ToastrService,
    private _spinner: NgxSpinnerService) {
    this.registerForm = _fb.group({
      name: ['Arun'],
      email: ['', Validators.required, Validators.email],
      phone: ['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      password: [''],
      gstin: [''],
      org_pan: [''],
      org_name: [''],
      org_address: [''],
      pref_product: ['', Validators.required],
      pref_product_size: [''],
      user_type: [''],
      company_gst: [''],
      company_linked_address: [''],
      company_pan: [''],
      company_name: [''],
      business_nature: [''],
      first_name: [''],
      last_name: [''],
      addressone: [''],
      address_proof_file: [''],
      cancel_cheque_file: ['']
    })
  }
  get f() { return this.registerForm.controls; }

  ngOnInit(): void {


  }
  firsttab() {
    this.addressTab = false;
    this.uploadTab = false
    this.mobileTab = true;
    this.ekycTab = false;
  }
  mobileTabContinue() {
    this.addressTab = false;
    this.uploadTab = false
    this.mobileTab = false;
    this.ekycTab = true;
  };

  ekycTabContinue() {
    this.mobileTab = false;
    this.uploadTab = false
    this.ekycTab = false;
    this.addressTab = true;
  };

  addressTabContinue() {
    this.mobileTab = false;
    this.ekycTab = false;
    this.addressTab = false;
    this.uploadTab = true;
  }
  selectCustomer(event: any) {
    console.log(event.target.value);
    this.userType = event.target.value;
  }
  onSelectCheckBox(event: any) {
    const productValue = event.target.value;
    this.chooseProduct.push(productValue);
    console.log(this.chooseProduct);
  };
  choosProductSize(event: any) {
    console.log(event.target.value);
    this.chooseProductSize = event.target.value;
  };
  selectBusiness(event: any) {
    console.log(event.target.value);
    this.businessType = event.target.value;
  };
  sendOtp(event: any) {
    this.mobileNumber = event.target.value;
  }
  getOpt() {
    this._spinner.show();
    let mobileNu = {
      mobile_no: this.mobileNumber
    };
    if (mobileNu.mobile_no == '') {
      this.toastr.error('Mobile number is required');
      this._spinner.hide();
      return;
    };
    this._auth.getOtp(mobileNu).subscribe(res => {
      if (res.status > 0) {
        this._spinner.hide();
        this.toastr.success(res.message);
        this.mobile = res.result;
        setTimeout(() => {
          this.mobile.otp = '';
        }, 30000);
        this.haveOtp = false;
      } else {
        this.toastr.error(res.message);
        this._spinner.hide();
      }
    }, error => {
      console.log(error);
      
    })
  };
  checkOtp(event: any) {
    this.verifyOtp = event.target.value;
  }
  checkVerifyOtp() {
    this._spinner.show();
    let otpVerify = {
      mobile_no: this.mobile.mob_number,
      otp: this.verifyOtp
    };

    if (otpVerify.mobile_no || otpVerify.otp > 0) {
      this._auth.verifyOtp(otpVerify).subscribe(res => {
        if (res.status > 0) {
          this._spinner.hide();
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
          this._spinner.hide();
        }
      }, error => {
        console.log(error);
      })
    }
  };

  getCancelcheck(event: any) {
    this.cancelCheckBook = event.target.files[0];
    console.log(this.cancelCheckBook);
  };

  getAddrssProfe(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('this.selectedFile=', this.selectedFile);

  };

  submitRegister() {
    const fileData = new FormData();
    this._spinner.show();
    this.submitted = true;
    let valueOfRegisterfor = this.registerForm.value.first_name;
    if(valueOfRegisterfor == '' || valueOfRegisterfor == null) {
      this.toastr.error('Please check required field');
      this._spinner.hide();
      return;
    };

      fileData.append('first_name', this.registerForm.value.first_name);
      fileData.append('last_name', this.registerForm.value.last_name);
      fileData.append('phone', this.mobileNumber);
      fileData.append('org_pan', this.registerForm.value.org_pan);
      fileData.append('org_name', this.registerForm.value.org_name);
      fileData.append('org_address', this.registerForm.value.org_address);
      fileData.append('user_type', this.userType);
      fileData.append('pref_product_size', this.chooseProductSize);
      fileData.append('email', this.registerForm.value.email);
      fileData.append('name', 'John');
      fileData.append('company_gst', this.registerForm.value.company_gst);
      fileData.append('company_pan', this.registerForm.value.company_pan);
      fileData.append('password', this.registerForm.value.password);
      fileData.append('address_proof_file', this.selectedFile);
      fileData.append('pref_product_size', this.chooseProductSize);
      fileData.append('pref_product', this.chooseProduct);
      fileData.append('user_type', this.userType);
      fileData.append('business_nature', this.businessType);
      fileData.append('cancel_cheque_file', this.cancelCheckBook);


      this._auth.register(fileData).subscribe((res) => {
          if (res) {
            console.log('res', res);
            this.toastr.success('Registered successfully', '');
            this.registerForm.reset();
            this._spinner.hide();
            this._router.navigate(['/login']);
          } else {
            this.toastr.error("Something went wrong");
            this._spinner.hide();
          }
        },
        (error) => {
          this.toastr.error('', error);
        }
      );
    
  };

}
