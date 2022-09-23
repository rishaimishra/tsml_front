import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('country')
  country!: ElementRef;
  @ViewChild('city')
  city!: ElementRef;
  @ViewChild('state')
  state!: ElementRef;

  countries = Country.getAllCountries();
  states: any | null;
  cities: any | null;
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;

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
  imageUrl: string = '';
  businessType: any;
  addressProfe: any;
  selectedFile: any;
  cancelCheckBook: any;
  panUpload: any;
  gstUpload: any;
  turnoverFile: any;
  itrFile: any;
  formDfile: any;
  consentLetter: any;
  regisCertificate: any;
  tcsFile: any;

  mobile: any;
  haveOtp: boolean = true;
  invildForm: boolean = true;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _auth: AuthService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService
  ) {
    this.registerForm = _fb.group({
      name: ['Arun'],
      email: ['', Validators.required, Validators.email],
      phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
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
      is_tcs_tds_applicable: [],
      addresstwo: [''],
      city: [''],
      state: [''],
      pincode: [''],
      address_type: [''],
      address_proof_file: ['', Validators.required],
      cancel_cheque_file: [''],
      pan_card_file: [''],
      gst_certificate: [''],
      turnover_declare: [''],
      itr_last_yr: [''],
      form_d: [''],
      registration_certificate: [''],
      tcs: [''],
    });
  }
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {}

  onCountryChange($event: any): void {
    this.states = State.getStatesOfCountry(
      JSON.parse(this.country.nativeElement.value).isoCode
    );
    this.selectedCountry = JSON.parse(this.country.nativeElement.value);
    this.cities = this.selectedState = this.selectedCity = null;
  }

  onStateChange(event: any): void {
    this.cities = City.getCitiesOfState(
      JSON.parse(this.country.nativeElement.value).isoCode,
      JSON.parse(this.state.nativeElement.value).isoCode
    );
    this.selectedState = JSON.parse(this.state.nativeElement.value);
    this.selectedCity = null;
  }

  onCityChange(event: any): void {
    this.selectedCity = JSON.parse(this.city.nativeElement.value);
  }

  firsttab() {
    this.addressTab = false;
    this.uploadTab = false;
    this.mobileTab = true;
    this.ekycTab = false;
  }
  mobileTabContinue() {
    this.addressTab = false;
    this.uploadTab = false;
    this.mobileTab = false;
    this.ekycTab = true;
  }

  ekycTabContinue() {
    this.mobileTab = false;
    this.uploadTab = false;
    this.ekycTab = false;
    this.addressTab = true;
  }

  addressTabContinue() {
    this.mobileTab = false;
    this.ekycTab = false;
    this.addressTab = false;
    this.uploadTab = true;
  }
  selectCustomer(event: any) {
    this.userType = event.target.value;
  }
  onSelectCheckBox(event: any) {
    const productValue = event.target.value;
    this.chooseProduct.push(productValue);
  }
  choosProductSize(event: any) {
    console.log(event.target.value);
    this.chooseProductSize = event.target.value;
  }
  selectBusiness(event: any) {
    this.businessType = event.target.value;
  }
  sendOtp(event: any) {
    this.mobileNumber = event.target.value;
  }
  getOpt() {
    this._spinner.show();
    let mobileNu = {
      mobile_no: this.mobileNumber,
    };
    if (mobileNu.mobile_no == '') {
      this.toastr.error('Mobile number is required');
      this._spinner.hide();
      return;
    }
    this._auth.getOtp(mobileNu).subscribe(
      (res) => {
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
      },
      (error) => {
        console.log(error);
      }
    );
  }
  checkOtp(event: any) {
    this.verifyOtp = event.target.value;
  }
  checkVerifyOtp() {
    this._spinner.show();
    let otpVerify = {
      mobile_no: this.mobile.mob_number,
      otp: this.verifyOtp,
    };

    if (otpVerify.mobile_no || otpVerify.otp > 0) {
      this._auth.verifyOtp(otpVerify).subscribe(
        (res) => {
          if (res.status > 0) {
            this._spinner.hide();
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
            this._spinner.hide();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getCancelcheck(event: any) {
    this.cancelCheckBook = event.target.files[0];
  }

  getAddrssProfe(event: any) {
    this.selectedFile = event.target.files[0];
  }
  uploadPan(event: any) {
    this.panUpload = event.target.files[0];
  }
  gstCertificateFileUpload(event: any) {
    this.gstUpload = event.target.files[0];
  }
  turnoverUpload(event: any) {
    this.turnoverFile = event.target.files[0];
  }
  itrFileUpload(event: any) {
    this.itrFile = event.target.files[0];
  }
  formDupload(event: any) {
    this.formDfile = event.target.files[0];
  }
  consentLetterUpload(event: any) {
    this.consentLetter = event.target.files[0];
  }
  regisCertificateUpload(event: any) {
    this.regisCertificate = event.target.files[0];
  }
  tcsFileUpload(event: any) {
    this.tcsFile = event.target.files[0];
  }
  submitRegister() {
    const fileData = new FormData();
    this._spinner.show();
    this.submitted = true;
    let valueOfRegisterfor = this.registerForm.value.first_name;
    if (valueOfRegisterfor == '' || valueOfRegisterfor == null) {
      this.toastr.error('Please check required field');
      this._spinner.hide();
      return;
    }

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
    fileData.append('pref_product_size', this.chooseProductSize);
    fileData.append('pref_product', this.chooseProduct);
    fileData.append('user_type', this.userType);
    fileData.append('business_nature', this.businessType);
    fileData.append('addressone', this.registerForm.value.addressone);
    fileData.append('addresstwo', this.registerForm.value.addresstwo);
    fileData.append('state', this.selectedState?.name);
    fileData.append('city', this.selectedCity?.name);
    fileData.append('pincode', this.registerForm.value.pincode);
    fileData.append('address_proof_file', this.selectedFile);
    fileData.append('cancel_cheque_file', this.cancelCheckBook);
    fileData.append('pan_card_file', this.panUpload);
    fileData.append('gst_certificate', this.gstUpload);
    fileData.append('turnover_declare', this.turnoverFile);
    fileData.append('itr_last_yr', this.itrFile);
    fileData.append('form_d', this.formDfile);
    fileData.append('registration_certificate', this.regisCertificate);
    fileData.append('tcs', this.tcsFile);

    this._auth.register(fileData).subscribe(
      (res: any) => {
        if (res.success) {
          console.log('res', res);
          this.toastr.success('Registered successfully', '');
          this.registerForm.reset();
          this._spinner.hide();
          this._router.navigate(['/login']);
        }
        if (res.error.validation.email) {
          this.toastr.error(res.error.validation.email);
          this._spinner.hide();
        } else {
          this.toastr.error('Something went wrong !');
          this._spinner.hide();
        }
      },
      (error) => {
        this.toastr.error('', error);
        this._spinner.hide();
      }
    );
  }
}
