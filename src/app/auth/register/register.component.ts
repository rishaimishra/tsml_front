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
import { ProductsService } from 'src/app/service/products.service';

declare var jQuery: any;
declare var $: any; 

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
  showResetUpload: boolean = false;
  showResetUpload2: boolean = false;
  showResetUpload3: boolean = false;
  showResetUpload4: boolean = false;
  showResetUpload5: boolean = false;
  showResetUpload6: boolean = false;
  showResetUpload7: boolean = false;
  showResetUpload8: boolean = false;
  showResetUpload9: boolean = false;
  showResetUpload10: boolean = false;


  cancelCheckBook: any;
  panUpload: any;
  gstUpload: any;
  turnoverFile: any;
  itrFile: any;
  formDfile: any;
  consentLetter: any;
  regisCertificate: any;
  tcsFile: any;
  isTermCondition: boolean = false;
  showFormD: boolean = false;
  orgAddr: any = '';
  orgName: any = '';
  gstNumber: any = '';
  linkedAddr: any = '';
  companyName: any = '';
  stateSelect: any = '';
  citySelect: any = '';
  pincodeSelect: any = '';
  addressLine1: any = '';
  addressLine2: any = '';

  mobile: any;
  haveOtp: boolean = true;
  invildForm: boolean = true;
  addressProof: boolean = false;
  checkbook: boolean = false;
  panCard: boolean = false;
  gstCertificate: boolean = false;
  turnOverFile: boolean = false;
  itrFileCheck: boolean = false;
  formD: boolean = false;
  consentFileSize: boolean = false;
  registerFileSize: boolean = false;
  tcsFileSize: boolean = false;
  isTDS_applicable: any;
  distributionValue: any;
  getGstNumber: any = '';
  addrrLine1: any = '';
  addrrLine2: any = '';
  billPincodeSelect: any = '';
  billCitySelect: any = '';
  billStateSelect: any = '';

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _auth: AuthService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private productService: ProductsService
  ) {
    this.registerForm = _fb.group({
      name: ['Sam'],
      email: ['', Validators.required, Validators.email],
      phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      password: ['', Validators.required],
      gstin: ['', Validators.required],
      gstin2: [''],
      org_pan: ['', Validators.required],
      org_name: [''],
      org_address: [''],
      pref_product: ['', Validators.required],
      pref_product_size: ['', Validators.required],
      user_type: [''],
      company_gst: [''],
      company_linked_address: [''],
      company_pan: ['', Validators.required],
      company_name: [''],
      business_nature: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      addressone: [''],
      addresstwo: [''],
      pan_dt: [''],
      gst_dt: [''],
      formD_dt: [''],
      tcs_dt: [''],
      city: [''],
      state: [''],
      pincode: [''],
      is_tcs_tds_applicable: [],
      address_type: [''],
      address_proof_file: ['', Validators.required],
      cancel_cheque_file: ['', Validators.required],
      pan_card_file: ['', Validators.required],
      gst_certificate: ['', Validators.required],
      turnover_declare: ['', Validators.required],
      itr_last_yr: ['', Validators.required],
      form_d: [''],
      registration_certificate: ['', Validators.required],
      tcs: ['', Validators.required],
      distribution: []
    });

  }
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {

  //   $( document ).ready(function() {
  //     $(".custom-file-input").on("change", function() {
  //       var fileName = $().val().split("\\").pop();
  //       $().siblings(".custom-file-label").addClass("selected").html(fileName);
  //     });
  //     $('#tree1').treed();
  // });

  }

  checkTerms(event: any) {
    this.isTermCondition = event.target.checked;
  }
  onCountryChange($event: any): void {
    this.states = State.getStatesOfCountry(
      JSON.parse(this.country.nativeElement.value).isoCode
    );
    this.selectedCountry = JSON.parse(this.country.nativeElement.value);
    this.cities = this.selectedState = this.selectedCity = null;
  }
  checkDistribution(event: any) {
    console.log(event.target.value);
    this.distributionValue = event.target.value;
  }
  onStateChange(event: any): void {
    this.cities = City.getCitiesOfState(
      JSON.parse(this.country.nativeElement.value).isoCode,
      JSON.parse(this.state.nativeElement.value).isoCode
    );
    this.selectedState = JSON.parse(this.state.nativeElement.value);
      this.registerForm.value.state = this.selectedState.name;
    this.selectedCity = null;
  }

  onCityChange(event: any): void {
    this.selectedCity = JSON.parse(this.city.nativeElement.value);
    this.registerForm.value.city = this.selectedCity.name;
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
    if (productValue == 'High Grade Friable Chrome Ore') {
      this.showFormD = true;
    }
    else if (productValue == 'Medium Grade Friable Chrome Ore') {
      this.showFormD = true;
    } else {
      this.showFormD = false;
    }
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
          // setTimeout(() => {
          //   this.mobile.otp = '';
          // }, 30000);
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
            this.mobile.otp = '';
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

  getAddrssProfe(event: any) {
    this.selectedFile = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload = true;
    }
    if (file.size >= 5209785) {
      this.addressProof = true;
      event.target.value = null;
      return;
    } else {
      this.addressProof = false;
    }
  }
  resetUpload() {
    this.selectedFile = '';
    this.showResetUpload = false;
  }
  getCancelcheck(event: any) {
    this.cancelCheckBook = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload2 = true;
    }
    if (file.size >= 5209785) {
      this.checkbook = true;
      event.target.value = null;
      return;
    } else {
      this.checkbook = false;
    }
  }
  resetCheckbook() {
    this.cancelCheckBook = '';
    this.showResetUpload2 = false;
  }
  uploadPan(event: any) {
    this.panUpload = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload3 = true;
    }
    if (file.size >= 5209785) {
      this.panCard = true;
      event.target.value = null;
      return;
    } else {
      this.panCard = false;
    }
  };
  resetPan() {
    this.panUpload = '';
    this.showResetUpload3 = false;
  }
  gstCertificateFileUpload(event: any) {
    this.gstUpload = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload4 = true;
    }
    if (file.size >= 5209785) {
      this.gstCertificate = true;
      event.target.value = null;
      return;
    } else {
      this.gstCertificate = false;
    }
  };
  resetGst() {
    this.gstUpload = '';
    this.showResetUpload4 = false;
  }
  turnoverUpload(event: any) {
    this.turnoverFile = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload5 = true;
    }
    if (file.size >= 5209785) {
      this.turnOverFile = true;
      event.target.value = null;
      return;
    } else {
      this.turnOverFile = false;
    }
  };
  resetTurnover() {
    this.turnoverFile = '';
    this.showResetUpload5 = false;
  }
  itrFileUpload(event: any) {
    this.itrFile = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload6 = true;
    }
    if (file.size >= 5209785) {
      this.itrFileCheck = true;
      event.target.value = null;
      return;
    } else {
      this.itrFileCheck = false;
    }
  };
  resetItr() {
    this.itrFile = '';
    this.showResetUpload6 = false;
  }
  formDupload(event: any) {
    this.formDfile = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload7 = true;
    }
    if (file.size >= 5209785) {
      this.formD = true;
      event.target.value = null;
      return;
    } else {
      this.formD = false;
    }
  };
  resetFormD() {
    this.formDfile = '';
    this.showResetUpload7 = false;
  }
  consentLetterUpload(event: any) {
    this.consentLetter = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload8 = true;
    }
    if (file.size >= 5209785) {
      this.consentFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.consentFileSize = false;
    }
  };
  resetConsent() {
    this.consentLetter = '';
    this.showResetUpload8 = false;
  }
  regisCertificateUpload(event: any) {
    this.regisCertificate = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload9 = true;
    }
    if (file.size >= 5209785) {
      this.registerFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.registerFileSize = false;
    }
  };
  resetCertificate() {
    this.regisCertificate = '';
    this.showResetUpload9 = false;

  }
  tcsFileUpload(event: any) {
    this.tcsFile = event.target.files[0];
    let file = event.target.files[0];
    if(file != '' || file != undefined) {
      this.showResetUpload10 = true;
    }
    if (file.size >= 5209785) {
      this.tcsFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.tcsFileSize = false;
    }
  };
  resetTcs() {
    this.tcsFile = '';
    this.showResetUpload10 = false;

  };
  getGstIn() {
    this._spinner.show();
    let gstin = this.registerForm.value.gstin;
    console.log(gstin);
    let apiKey = '136c3da3b6f6b3af36388cc975b7aca0';
    let url = apiKey + '/' + gstin;
    if (gstin) {
      this.productService.getGstin(url).subscribe((res: any) => {
        if(res.flag == true) {
          this._spinner.hide();
          this.toastr.success(res.message);
          this.orgAddr = res.data.pradr.adr;
          this.orgName = res.data.ctb;
          this.gstNumber = res.data.gstin;
          this.linkedAddr = res.data.stj;
          this.companyName = res.data.tradeNam;
          this.stateSelect = res.data.pradr.addr.stcd;
          this.citySelect = res.data.pradr.addr.dst;
          this.pincodeSelect = res.data.pradr.addr.pncd;
          this.addressLine1 = res.data.pradr.adr;
          this.addressLine2 = res.data.stj;
        }
        if (res.flag == false) {
          this._spinner.hide();
          this.toastr.error(res.message);
        }
      }, err => {
        console.log(err);
        this._spinner.hide();
      })
    }
  };

  gstinDetails() {
    this._spinner.show();
    let gstin = this.getGstNumber;
    console.log(gstin);
    let apiKey = '136c3da3b6f6b3af36388cc975b7aca0';
    let url = apiKey + '/' + gstin;
    if (gstin) {
      this.productService.getGstin(url).subscribe((res: any) => {
        if(res.flag == true) {
          this._spinner.hide();
          this.toastr.success(res.message);
          // this.orgAddr = res.data.pradr.adr;
          // this.orgName = res.data.ctb;
          // this.gstNumber = res.data.gstin;
          // this.linkedAddr = res.data.stj;
          // this.companyName = res.data.tradeNam;
          this.billStateSelect = res.data.pradr.addr.stcd;
          this.billCitySelect = res.data.pradr.addr.dst;
          this.billPincodeSelect = res.data.pradr.addr.pncd;
          this.addrrLine1 = res.data.pradr.adr;
          this.addrrLine2 = res.data.stj;
        }
        if (res.flag == false) {
          this._spinner.hide();
          this.toastr.error(res.message);
        }
      }, err => {
        console.log(err);
        this._spinner.hide();
      })
    }
  }
  isTdsApplicable(event: any) {
    console.log(event.target.checked);
    this.isTDS_applicable = event.target.checked;
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
    fileData.append('is_tcs_tds_applicable', this.isTDS_applicable);
    fileData.append('distribution', this.distributionValue);
    fileData.append('pan_dt', this.registerForm.value.pan_dt);
    fileData.append('gst_dt', this.registerForm.value.gst_dt);
    fileData.append('formD_dt', this.registerForm.value.formD_dt);
    fileData.append('tcs_dt', this.registerForm.value.tcs_dt);


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
