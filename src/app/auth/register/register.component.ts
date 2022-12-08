import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
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
import Swal from 'sweetalert2';

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

  addProof!: string | ArrayBuffer | null;
  checkBook!: string | ArrayBuffer | null;
  panCardUpload!: string | ArrayBuffer | null;
  gstFile!: string | ArrayBuffer | null;
  turnOver!: string | ArrayBuffer | null;
  itrFileUpl!: string | ArrayBuffer | null;
  consentFile!: string | ArrayBuffer | null;
  cerftificateUpl!: string | ArrayBuffer | null;
  tcsUplod!: string | ArrayBuffer | null;

  mobile: any;
  haveOtp: boolean = true;
  emailId:any;
  password:any;
  gstNum:any;
  orgPan:any;
  orgName:any;
  orgAddrs:any;
  linkedAddr:any;
  gstNumber:any;
  panDate: any;
  gstDate:any;
  formDdate:any;
  tcsDate:any;

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
  checkedYes: boolean = false;
  checkedNo: boolean = false;
  businessChecked: boolean = false;
  intrestedIndistribution: boolean = false;
  addressForm: FormGroup;
  shiptingForm: FormGroup;
  arr: FormArray;
  shiptArr: FormArray;
  billingAdd:any = [];
  shiptingAdd:any = [];

  ferroChrome = [
    { id: 1, select: false, name: 'High' },
    { id: 2, select: false, name: 'Low' },
    { id: 3, select: false, name: 'Medium' },
    { id: 4, select: false, name: 'Low Silicone' },
    { id: 5, select: false, name: 'HC Ferro Chrome (Chips & Fines)' },

  ];
  chromeOre = [
    { id: 1, select: false, name: 'High Grade Friable Chrome Ore' },
    { id: 2, select: false, name: 'Medium Grade Friable Chrome Ore' },
  ];

  selectProduct = [
    { id: 1, select: false, name: '10-50' },
    { id: 2, select: false, name: '10-60' },
    { id: 3, select: false, name: '10-70' },
    { id: 4, select: false, name: '10-80' },
    { id: 5, select: false, name: '10-100' },
    { id: 6, select: false, name: '10-150' },
  ];
  address_proof_file: string | number;

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _auth: AuthService,
    private toastr: ToastrService,
    private _spinner: NgxSpinnerService,
    private productService: ProductsService
  ) {
    // this.registerForm = _fb.group({
    //   name: ['Sam'],
    //   email: ['', Validators.required, Validators.email],
    //   phone: ['',[Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    //   password: ['', Validators.required],
    //   gstin: ['', Validators.required],
    //   org_pan: ['', Validators.required],
    //   org_name: [''],
    //   org_address: [''],
    //   pref_product: ['', Validators.required],
    //   pref_product_size: ['', Validators.required],
    //   user_type: [''],
    //   company_gst: [''],
    //   company_linked_address: [''],
    //   // billing_address: this._fb.array([]),
    //   addressone: [''],
    //   addresstwo: [''],
    //   city: [''],
    //   state: [''],
    //   pincode: [''],
    //   company_pan: ['', Validators.required],
    //   company_name: [''],
    //   business_nature: ['', Validators.required],
    //   first_name: [''],
    //   pan_dt: [''],
    //   gst_dt: [''],
    //   formD_dt: [''],
    //   tcs_dt: [''],
    //   is_tcs_tds_applicable: [],
    //   address_type: [''],
    //   address_proof_file: ['', Validators.required],
    //   cancel_cheque_file: ['', Validators.required],
    //   pan_card_file: ['', Validators.required],
    //   gst_certificate: ['', Validators.required],
    //   turnover_declare: ['', Validators.required],
    //   itr_last_yr: ['', Validators.required],
    //   form_d: [''],
    //   registration_certificate: ['', Validators.required],
    //   tcs: ['', Validators.required],
    //   distribution: []
    // });

  }

  get ff() { return this.addressForm.controls; }
  get t() { return this.f.arr as FormArray; }

  get fff() { return this.shiptingForm.controls; }
  get at() { return this.sf.shiptArr as FormArray; }

  getControl(item: AbstractControl): FormControl { return item as FormControl; }
  
  get f(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  };
  get sf(): { [key: string]: AbstractControl } {
    return this.shiptingForm.controls;
  };

  ngOnInit(): void {
    this.addressForm = this._fb.group({
      credentials: this._fb.array([this.createItem('','','','','','')])
    })
    // Shipting Form
    this.shiptingForm = this._fb.group({
      shipping: this._fb.array([this.createShiptItem('','','','','','')])
    })
  }
  createItem(gstin:any,state:any,city:any,addrOne:any,addrTwo:any,pincode:any) {
    return this._fb.group({
      addressone: [addrOne],
      gstin: [gstin],
      billing: [''],
      addresstwo: [addrTwo],
      city: [city],
      state: [state],
      pincode: [pincode],
    })
  };

  createShiptItem(gstin:any,state:any,city:any,addrOne:any,addrTwo:any,pincode:any) {
    return this._fb.group({
      addressone: [addrOne],
      gstin: [gstin],
      billing: [''],
      addresstwo: [addrTwo],
      city: [city],
      state: [state],
      pincode: [pincode],
    })
  };

  addItem() {
    this.billingAdd = this.addressForm.controls.credentials as FormArray;
    this.billingAdd.push (this._fb.group({
      addressone: [''],
      gstin: [''],
      billing: [''],
      addresstwo: [''],
      city: [''],
      state: [''],
      pincode: [''],
    }))

    console.log('billing',this.billingAdd.value);
  };

  addShitpItem() {
    this.shiptingAdd = this.shiptingForm.controls.shipping as FormArray;
    this.shiptingAdd.push (this._fb.group({
      addressone: [''],
      gstin: [''],
      billing: [''],
      addresstwo: [''],
      city: [''],
      state: [''],
      pincode: [''],
    }))
    console.log('shipi',this.shiptingAdd.value);
  };

  // saveAddr() {
  //   console.log('billingAdd',this.billingAdd.value);
  // };

  checkTerms(event: any) {
    this.isTermCondition = event.target.checked;
  };
  onCountryChange($event: any): void {
    this.states = State.getStatesOfCountry(
      JSON.parse(this.country.nativeElement.value).isoCode
    );
    this.selectedCountry = JSON.parse(this.country.nativeElement.value);
    this.cities = this.selectedState = this.selectedCity = null;
  };

  checkDistributionYes(event: any) {
    this.intrestedIndistribution = true;
    this.distributionValue = event.target.value;
    this.checkedYes = event.target.checked;
    this.checkedNo = false;
  };

  checkDistributionNo(event: any) {
    this.intrestedIndistribution = false;
    this.distributionValue = event.target.value;
    this.checkedNo = event.target.checked;
    this.checkedYes = false;
  };
  onStateChange(event: any): void {
    this.cities = City.getCitiesOfState(
      JSON.parse(this.country.nativeElement.value).isoCode,
      JSON.parse(this.state.nativeElement.value).isoCode
    );
    this.selectedState = JSON.parse(this.state.nativeElement.value);
    this.registerForm.value.state = this.selectedState.name;
    this.selectedCity = null;
  };

  onCityChange(event: any): void {
    this.selectedCity = JSON.parse(this.city.nativeElement.value);
    this.registerForm.value.city = this.selectedCity.name;
  };

  firsttab() {
    this.addressTab = false;
    this.uploadTab = false;
    this.mobileTab = true;
    this.ekycTab = false;
  };
  mobileTabContinue() {
    this.addressTab = false;
    this.uploadTab = false;
    this.mobileTab = false;
    this.ekycTab = true;
  };

  ekycTabContinue() {
    this.mobileTab = false;
    this.uploadTab = false;
    this.ekycTab = false;
    this.addressTab = true;
  };

  addressTabContinue() {
    this.mobileTab = false;
    this.ekycTab = false;
    this.addressTab = false;
    this.uploadTab = true;
  };
  selectCustomer(event: any) {
    this.userType = event.target.value;
  };

  onSelectFerroChrome(event: any) {
    const productValue = event.target.value;
    const name = event.target.value;
    const isChecked = event.target.checked;

    this.ferroChrome.map((selectedName: any) => {
      if (selectedName.name == name) {
        selectedName.select = isChecked;
        if (selectedName.select == true) {
          this.chooseProduct.push(selectedName.name);
        } else {
          this.chooseProduct.splice(selectedName.name, 1);
        }
        return selectedName;
      }
      return selectedName;
    });
  };
  onSelectChromeOre(event: any) {
    const productValue = event.target.value;
    if (productValue == 'High Grade Friable Chrome Ore') {
      this.showFormD = true;
    }
    else if (productValue == 'Medium Grade Friable Chrome Ore') {
      this.showFormD = true;
    } else {
      this.showFormD = false;
    }
    const name = event.target.value;
    const isChecked = event.target.checked;

    this.chromeOre.map((selectedName: any) => {
      if (selectedName.name == name) {
        selectedName.select = isChecked;
        if (selectedName.select == true) {
          this.chooseProduct.push(selectedName.name);
        } else {
          this.chooseProduct.splice(selectedName.name, 1);
        }
        console.log(this.chooseProduct);
        return selectedName;
      }
      return selectedName;
    });
  };

  choosProductSize(event: any) {
    this.chooseProductSize = event.target.value;
    const name = event.target.value;
    const isChecked = event.target.checked;

    this.selectProduct.map((selectedName: any) => {
      if (selectedName.name == name) {
        selectedName.select = isChecked;
        return selectedName;
      }
      return selectedName;
    });
  };

  selectBusiness(event: any) {
    this.businessType = event.target.value;
    if (this.businessType == 'Trader' || this.businessType == 'Manufacturer & Trader') {
      this.businessChecked = true;
    } else {
      this.businessChecked = false;
    }
  };
  sendOtp(event: any) {
    this.mobileNumber = event.target.value;
  };

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
  };
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
  };

  getAddrssProfe(event: any) {
    this.selectedFile = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload = true;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.addProof = reader.result;
    };
    if (file.size >= 5209785) {
      this.addressProof = true;
      event.target.value = null;
      return;
    } else {
      this.addressProof = false;
    }

  };
  resetUpload() {
    // this.resetFile(this.file1);
    this.addProof = null;
    this.selectedFile = '';
    this.showResetUpload = false;
  };

  getCancelcheck(event: any) {
    this.cancelCheckBook = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload2 = true;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.checkBook = reader.result;
    };
    if (file.size >= 5209785) {
      this.checkbook = true;
      event.target.value = null;
      return;
    } else {
      this.checkbook = false;
    }
  };
  resetCheckbook() {
    this.checkBook = null;
    this.cancelCheckBook = '';
    this.showResetUpload2 = false;
  };
  uploadPan(event: any) {
    this.panUpload = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload3 = true;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.panCardUpload = reader.result;
    };
    if (file.size >= 5209785) {
      this.panCard = true;
      event.target.value = null;
      return;
    } else {
      this.panCard = false;
    }
  };
  resetPan() {
    this.panCardUpload = null;
    this.panUpload = '';
    this.showResetUpload3 = false;
  };
  gstCertificateFileUpload(event: any) {
    this.gstUpload = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload4 = true;
    };
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.gstFile = reader.result;
    };
    if (file.size >= 5209785) {
      this.gstCertificate = true;
      event.target.value = null;
      return;
    } else {
      this.gstCertificate = false;
    }
  };
  resetGst() {
    this.gstFile = null;
    this.gstUpload = '';
    this.showResetUpload4 = false;
  }
  turnoverUpload(event: any) {
    this.turnoverFile = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload5 = true;
    };
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.turnOver = reader.result;
    };
    if (file.size >= 5209785) {
      this.turnOverFile = true;
      event.target.value = null;
      return;
    } else {
      this.turnOverFile = false;
    }
  };
  resetTurnover() {
    this.turnOver = null;
    this.turnoverFile = '';
    this.showResetUpload5 = false;
  };
  itrFileUpload(event: any) {
    this.itrFile = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload6 = true;
    };
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.itrFileUpl = reader.result;
    };
    if (file.size >= 5209785) {
      this.itrFileCheck = true;
      event.target.value = null;
      return;
    } else {
      this.itrFileCheck = false;
    }
  };
  resetItr() {
    this.itrFileUpl = null;
    this.itrFile = '';
    this.showResetUpload6 = false;
  };
  formDupload(event: any) {
    this.formDfile = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
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
  };
  consentLetterUpload(event: any) {
    this.consentLetter = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload8 = true;
    };
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.consentFile = reader.result;
    };
    if (file.size >= 5209785) {
      this.consentFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.consentFileSize = false;
    }
  };
  resetConsent() {
    this.consentFile = null;
    this.consentLetter = '';
    this.showResetUpload8 = false;
  }
  regisCertificateUpload(event: any) {
    this.regisCertificate = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload9 = true;
    };
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.cerftificateUpl = reader.result;
    };
    if (file.size >= 5209785) {
      this.registerFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.registerFileSize = false;
    }
  };
  resetCertificate() {
    this.cerftificateUpl = null;
    this.regisCertificate = '';
    this.showResetUpload9 = false;

  }
  tcsFileUpload(event: any) {
    this.tcsFile = event.target.files[0];
    let file = event.target.files[0];
    if (file != '' || file != undefined) {
      this.showResetUpload10 = true;
    };
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.tcsUplod = reader.result;
    };
    if (file.size >= 5209785) {
      this.tcsFileSize = true;
      event.target.value = null;
      return;
    } else {
      this.tcsFileSize = false;
    }
  };
  resetTcs() {
    this.tcsUplod = null;
    this.tcsFile = '';
    this.showResetUpload10 = false;

  };
  getGstIn() {
    this._spinner.show();
    let gstin = this.gstNum;
    if (gstin == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Provide Valid GST Number !',
      })
      this._spinner.hide();
      return;
    }
    // let  apiUrl =  '/gst-details/' + gstin;
    // this.productService.getMethod(apiUrl).subscribe((res: any) => {
    this._auth.gstApi().subscribe((res: any) => {
      this._spinner.hide();
          this._spinner.hide();
          this.toastr.success(res.message);
          const withoutFirstAndLast = res.result.gstin.slice(2, -3);
          let state = res.result.pradr.addr.stcd;
          let city = res.result.pradr.addr.dst;
          let pincode = res.result.pradr.addr.pncd;
          let addrOne = res.result.pradr.addr.bnm;
          let addrTwo = res.result.pradr.addr.st;
          let gstin = res.result.gstin;
          this.linkedAddr = res.result.stj;
          this.orgAddrs = res.result.pradr.addr.stcd;
          this.orgName = res.result.lgnm;
          this.orgPan = withoutFirstAndLast;
          this.gstNumber = res.result.gstin;
          
          this.addressForm = this._fb.group({
            credentials: this._fb.array([])
          })
          this.billingAdd = this.addressForm.get('credentials') as FormArray;
          this.billingAdd.push(this.createItem(gstin,state,city,addrOne,addrTwo,pincode));

          // shipping addr
          this.shiptingForm = this._fb.group({
            shipping: this._fb.array([])
          })
          this.shiptingAdd = this.shiptingForm.get('shipping') as FormArray;
          this.shiptingAdd.push(this.createShiptItem(gstin,state,city,addrOne,addrTwo,pincode));

        if (res.flag == false) {
          this._spinner.hide();
          this.toastr.error(res.message);
        }
      }, err => {
        console.log(err);
        this._spinner.hide();
      })
    
  };

  billGstin(i:any) {
    this._spinner.show();
    let gstin = this.getGstNumber;
      this._auth.gstApi().subscribe((res: any) => {
          this._spinner.hide();
          this.toastr.success(res.message);
          let state = res.result.pradr.addr.stcd;
          let city = res.result.pradr.addr.dst;
          let pincode = res.result.pradr.addr.pncd;
          let addrOne = res.result.pradr.addr.bnm;
          let addrTwo = res.result.pradr.addr.st;
          let gstin = res.result.gstin;
          // $('#adr_'+i).val(addrOne);
          ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('addressone').patchValue(addrOne);
          ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('addresstwo').patchValue(addrTwo);
          ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('city').patchValue(city);
          ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('state').patchValue(state);
          ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('pincode').patchValue(pincode);
        if (res.flag == false) {
          this._spinner.hide();
          this.toastr.error(res.message);
        }
      }, err => {
        console.log(err);
        this._spinner.hide();
      })
  }
  shipGstin(i:any) {
    this._spinner.show();
    let gstin = this.getGstNumber;
      this._auth.gstApi().subscribe((res: any) => {
          this._spinner.hide();
          this.toastr.success(res.message);
          let state = res.result.pradr.addr.stcd;
          let city = res.result.pradr.addr.dst;
          let pincode = res.result.pradr.addr.pncd;
          let addrOne = res.result.pradr.addr.bnm;
          let addrTwo = res.result.pradr.addr.st;
          let gstin = res.result.gstin;
          // $('#adr_'+i).val(addrOne);
          ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('addressone').patchValue(addrOne);
          ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('addresstwo').patchValue(addrTwo);
          ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('city').patchValue(city);
          ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('state').patchValue(state);
          ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('pincode').patchValue(pincode);
        if (res.flag == false) {
          this._spinner.hide();
          this.toastr.error(res.message);
        }
      }, err => {
        console.log(err);
        this._spinner.hide();
      })
  }

  isTdsApplicable(event: any) {
    this.isTDS_applicable = event.target.checked;
  }
  submitRegister() {
    const fileData = new FormData();
    this._spinner.show();
    // this.submitted = true;

    if (!this.addProof) {
      this.toastr.error('', 'Address proof required');
      this._spinner.hide();
      return;
    };
    if (!this.checkBook) {
      this.toastr.error('', 'Checkbook is required');
      this._spinner.hide();
      return;
    };
    if (!this.panCardUpload) {
      this.toastr.error('', 'Pan is required');
      this._spinner.hide();
      return;
    };
    if (!this.gstFile) {
      this.toastr.error('', 'GST certificate is required');
      this._spinner.hide();
      return;
    };
    if (!this.turnOver) {
      this.toastr.error('', 'Turnover-section is required');
      this._spinner.hide();
      return;
    };
    if (!this.itrFileUpl) {
      this.toastr.error('', 'ITR file is required');
      this._spinner.hide();
      return;
    };
    if (!this.consentFile) {
      this.toastr.error('', 'Consent Letter is required');
      this._spinner.hide();
      return;
    };
    if (!this.cerftificateUpl) {
      this.toastr.error('', 'Registration Certificates is required');
      this._spinner.hide();
      return;
    };
    if (!this.tcsUplod) {
      this.toastr.error('', 'TCS is required');
      this._spinner.hide();
      return;
    }

    // fileData.append('first_name', this.registerForm.value.first_name);
    fileData.append('user_type', 'C');
    fileData.append('phone', this.mobileNumber);
    fileData.append('org_pan', this.orgPan);
    fileData.append('org_name', this.orgName);
    fileData.append('org_address', this.orgAddrs);
    fileData.append('tcs_dt', this.isTDS_applicable);
    fileData.append('pref_product_size', this.chooseProductSize);
    fileData.append('email', this.emailId);
    fileData.append('name', '');
    fileData.append('company_gst', this.gstNum);
    fileData.append('company_pan', this.orgPan);
    fileData.append('password', this.password);
    fileData.append('pref_product', this.chooseProduct);
    fileData.append('business_nature', this.businessType);
    fileData.append('billing_address', JSON.stringify(this.billingAdd.value));
    fileData.append('shipping_address', JSON.stringify(this.shiptingAdd.value));
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
    fileData.append('pan_dt', this.panDate);
    fileData.append('gst_dt', this.gstDate);
    fileData.append('formD_dt', this.formDdate);
    fileData.append('tcs_dt', this.tcsDate);

    this._auth.register(fileData).subscribe((res: any) => {
      this._spinner.hide();
        if (res.success) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            text: 'Register Successfully',
            showConfirmButton: false,
            timer: 1500
          })
          this._router.navigate(['/auth/login']);
          this.registerForm.reset();
          this._spinner.hide();
        }
        if (res.error.validation?.email) {
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
