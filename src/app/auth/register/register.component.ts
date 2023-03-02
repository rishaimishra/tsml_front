
import { Component, OnInit } from '@angular/core';
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
import { ProductsService } from 'src/app/service/products.service';
import Swal from 'sweetalert2';
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
  emailId: any;
  password: any;
  gstNum: any;
  orgPan: any;
  orgName: any;
  orgAddrs: any;
  linkedAddr: any;
  gstNumber: any;
  panDate: any;
  gstDate: any;
  formDdate: any;
  tcsDate: any;

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
  securityForm: FormGroup;
  billingAdd: any = [];
  shiptingAdd: any = [];
  billGstNum: any;
  shipGst: any;
  chipsFinesSize: boolean = false;
  emailMsg:any;
  emailErr: boolean = true;
  disableInput: boolean = true;
  addrPdferor: boolean = false;
  cancPdferor: boolean = false;
  panPdferor: boolean = false;
  gstPdferor: boolean = false;
  turnPdferor: boolean = false;
  itrPdferor: boolean = false;
  fmDPdferor: boolean = false;
  consntPdferor: boolean = false;
  certPdferor: boolean = false;
  tcsPdferor: boolean = false;
  questions: any;
  submit: boolean = false;
  validMobile: boolean = false;
  errorMsg: boolean = true;
  hide = true;
  securityParam: boolean = true;
  
  public showPassword: boolean;
  public showPasswordOnPress: boolean;
  

  ferroChrome = [
    { id: 1, select: false, name: 'High Phos' },
    { id: 2, select: false, name: 'Medium Phos' },
    { id: 3, select: false, name: 'Low Phos' },
    { id: 4, select: false, name: 'Low Silicon ' },
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
  ) 
  { 
    this.securityForm = this._fb.group({
      eamil: [''],
      securityone: ['', Validators.required],
      answoreone: ['', Validators.required,Validators.maxLength(20)],
      securitytwo: ['',Validators.required],
      answoretwo: ['', Validators.required, Validators.maxLength(20)]
    })
  }

  get ff() { return this.addressForm.controls; }
  get tf() { return this.securityForm.controls; }
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
      credentials: this._fb.array([this.createItem('', '', '', '', '', '', '')])
    })
    // Shipting Form
    this.shiptingForm = this._fb.group({
      shipping: this._fb.array([this.createShiptItem('', '', '', '', '', '', '')])
    })

    this.getQuestions();
  }
  createItem(gstin: any, state: any, city: any, addrOne: any, addrTwo: any, pincode: any, company: any) {
    return this._fb.group({
      addressone: [addrOne],
      gstin: [gstin],
      billing: [''],
      addresstwo: [addrTwo],
      city: [city],
      state: [state],
      company_name: [company],
      pincode: [pincode],
    })
  };

  createShiptItem(gstin: any, state: any, city: any, addrOne: any, addrTwo: any, pincode: any, company: any) {
    return this._fb.group({
      addressone: [addrOne],
      gstin: [gstin],
      billing: [''],
      addresstwo: [addrTwo],
      company_name: [company],
      city: [city],
      state: [state],
      pincode: [pincode],
    })
  };

  addItem() {
    this.billingAdd = this.addressForm.controls.credentials as FormArray;
    this.billingAdd.push(this._fb.group({
      addressone: [''],
      gstin: [''],
      billing: [''],
      addresstwo: [''],
      company_name: [''],
      city: [''],
      state: [''],
      pincode: [''],
    }))

  };

  addShitpItem() {
    this.shiptingAdd = this.shiptingForm.controls.shipping as FormArray;
    this.shiptingAdd.push(this._fb.group({
      addressone: [''],
      gstin: [''],
      billing: [''],
      addresstwo: [''],
      company_name: [''],
      city: [''],
      state: [''],
      pincode: [''],
    }))
    console.log('shipi', this.shiptingAdd.value);
  };

  // saveAddr() {
  //   console.log('billingAdd',this.billingAdd.value);
  // };

  checkTerms(event: any) {
    this.isTermCondition = event.target.checked;
  };
  // onCountryChange($event: any): void {
  //   this.states = State.getStatesOfCountry(
  //     JSON.parse(this.country.nativeElement.value).isoCode
  //   );
  //   this.selectedCountry = JSON.parse(this.country.nativeElement.value);
  //   this.cities = this.selectedState = this.selectedCity = null;
  // };

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
  // onStateChange(event: any): void {
  //   this.cities = City.getCitiesOfState(
  //     JSON.parse(this.country.nativeElement.value).isoCode,
  //     JSON.parse(this.state.nativeElement.value).isoCode
  //   );
  //   this.selectedState = JSON.parse(this.state.nativeElement.value);
  //   this.registerForm.value.state = this.selectedState.name;
  //   this.selectedCity = null;
  // };

  // onCityChange(event: any): void {
  //   this.selectedCity = JSON.parse(this.city.nativeElement.value);
  //   this.registerForm.value.city = this.selectedCity.name;
  // };

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
    const name = event.target.value;
    const isChecked = event.target.checked;
    this.ferroChrome.map((selectedName: any) => {
      let indx = this.chooseProduct.findIndex((item: any) => item == event.target.value);

      if (selectedName.name == name) {
        selectedName.select = isChecked;
        if (selectedName.select == true) {
          this.chooseProduct.push(selectedName.name);
        } else {
          this.chooseProduct.splice(indx, 1);
        }
        let dd = this.chooseProduct.includes("HC Ferro Chrome (Chips & Fines)");
        if (dd != false) {
          this.chipsFinesSize = true;
        } else {
          this.chipsFinesSize = false;
        }
        return selectedName;
      }
      return selectedName;
    });
  };

  chinpsAndFinesSize(event:any) {
    let data = event.target.value;
    this.chooseProductSize = data;
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
    if(this.mobileNumber.length> 10 || this.mobileNumber.length < 10) {
      this.validMobile = true;
    } else {
      this.validMobile = false;
    }
  };

  getOpt() {
    this._spinner.show();
    let mobileNu = {
      mobile_no: this.mobileNumber,
      email: this.emailId
    };
    if (mobileNu.mobile_no == '') {
      this.toastr.error('Mobile number is required');
      this._spinner.hide();
      return;
    }
    this._auth.getOtp(mobileNu).subscribe((res:any) => {
        if (res.status > 0) {
          this._spinner.hide();
          this.toastr.success(res.message);
          this.mobile = res.result;
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
    // if (this.mobileNumber == '') {
    //   this.toastr.error('Mobile number is required');
    //   return;
    // }
    // if (this.emailId == '') {
    //   this.toastr.error('Email is required');
    //   return;
    // }
    if (this.verifyOtp == undefined) {
      this.toastr.error('OTP is required');
      return;
    }
    console.log(this.verifyOtp);
    let otpVerify = {
      mobile_no: this.mobileNumber,
      email: this.emailId,
      otp: this.verifyOtp,
    };
    this._spinner.show();
      this._auth.verifyOtp(otpVerify).subscribe((res:any) => {
        this._spinner.hide();
          if (res.status != 0) {
            // this.mobile.otp = '';
            this.emailId = res.result['email'],
            this.mobileNumber = res.result['mob_number'],
            this.verifyOtp = null;
            this.disableInput = false;
            this._spinner.hide();
            this.toastr.success(res.message);
          } else {
            this.toastr.error(res.message);
            this._spinner.hide();
            this.disableInput = true;
          }
        },(error) => {
          console.log(error);
          this._spinner.hide();
        }
      );
  };

  getAddrssProfe(event: any) {
    this.selectedFile = event.target.files[0];
      if(
      this.selectedFile.type !== "application/pdf" ){
        this.addrPdferor = true;
        this.resetUpload();
        return;
      } else {
        this.addrPdferor = false;
      }
    let file = event.target.files[0];
    let checkPdf = file.type.includes('/pdf');
    if (file != '' || file != undefined && checkPdf == false) {
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
    if(
      this.cancelCheckBook.type !== "application/pdf" ){
        this.cancPdferor = true;
        this.resetCheckbook();
        return;
      } else {
        this.cancPdferor = false;
      }

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
    if(
      this.panUpload.type !== "application/pdf" ){
        this.panPdferor = true;
        this.resetPan();
        return;
      } else {
        this.panPdferor = false;
      }

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
    if(
      this.gstUpload.type !== "application/pdf" ){
        this.gstPdferor = true;
        this.resetGst();
        return;
      } else {
        this.gstPdferor = false;
      }
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
  };

  turnoverUpload(event: any) {
    this.turnoverFile = event.target.files[0];
    if(
      this.turnoverFile.type !== "application/pdf" ){
        this.turnPdferor = true;
        this.resetTurnover();
        return;
      } else {
        this.turnPdferor = false;
      }

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
    if(
      this.itrFile.type !== "application/pdf" ){
        this.itrPdferor = true;
        this.resetItr();
        return;
      } else {
        this.itrPdferor = false;
      }

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
    if(
      this.formDfile.type !== "application/pdf" ){
        this.fmDPdferor = true;
        this.resetFormD();
        return;
      } else {
        this.fmDPdferor = false;
      }

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
    if(
      this.consentLetter.type !== "application/pdf" ){
        this.consntPdferor = true;
        this.resetConsent();
        return;
      } else {
        this.consntPdferor = false;
      }

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
  };

  regisCertificateUpload(event: any) {
    this.regisCertificate = event.target.files[0];
    if(
      this.regisCertificate.type !== "application/pdf" ){
        this.certPdferor = true;
        this.resetCertificate();
        return;
      } else {
        this.certPdferor = false;
      }
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
  };

  tcsFileUpload(event: any) {
    this.tcsFile = event.target.files[0];
    if(
      this.tcsFile.type !== "application/pdf" ){
        this.tcsPdferor = true;
        this.resetTcs();
        return;
      } else {
        this.tcsPdferor = false;
      }

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
    if (this.gstNum == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Provide Valid GST Number !',
      })
      this._spinner.hide();
      return;
    }

    this.productService.getMjGstIn(this.gstNum).subscribe((res: any) => {
      this._spinner.hide();
      this.toastr.success('','Success');
      const withoutFirstAndLast = res.gstin.slice(2, -3);
      let state = res.pradr.addr.stcd;
      let city = res.pradr.addr.dst;
      let pincode = res.pradr.addr.pncd;
      let addrOne = res.pradr.addr.bnm;
      let addrTwo = res.pradr.addr.st;
      let gstin = res.gstin;
      this.linkedAddr = res.stj;
      this.orgAddrs = res.pradr.addr.stcd;
      this.orgName = res.tradeNam;
      this.orgPan = withoutFirstAndLast;
      this.gstNumber = res.gstin;

      this.addressForm = this._fb.group({
        credentials: this._fb.array([])
      })
      this.billingAdd = this.addressForm.get('credentials') as FormArray;
      this.billingAdd.push(this.createItem(gstin, state, city, addrOne, addrTwo, pincode, this.orgName));

      // shipping addr
      this.shiptingForm = this._fb.group({
        shipping: this._fb.array([])
      })
      this.shiptingAdd = this.shiptingForm.get('shipping') as FormArray;
      this.shiptingAdd.push(this.createShiptItem(gstin, state, city, addrOne, addrTwo, pincode, this.orgName));

      if (res.flag == false) {
        this._spinner.hide();
        this.toastr.error(res.message);
      }
    }, err => {
      console.log(err);
      this._spinner.hide();
      this.toastr.error('Please enter valid GST number.','Sorry !');
    })

  };
  gstNumbr(event: any) {
    this.billGstNum = event.target.value;
  };

  billGstin(i: any) {
    this._spinner.show;
    this.productService.getMjGstIn(this.billGstNum).subscribe((res: any) => {
      this._spinner.hide();
      this.toastr.success('','Success');
      let state = res.pradr.addr.stcd;
      let city = res.pradr.addr.dst;
      let pincode = res.pradr.addr.pncd;
      let addrOne = res.pradr.addr.bnm;
      let addrTwo = res.pradr.addr.st;
      let gstin = res.gstin;
      let companyName = res.lgnm;
      // $('#adr_'+i).val(addrOne);
      ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('company_name').patchValue(companyName);
      ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('addressone').patchValue(addrOne);
      ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('addresstwo').patchValue(addrTwo);
      ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('city').patchValue(city);
      ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('state').patchValue(state);
      ((this.addressForm.get('credentials') as FormArray).at(i) as FormGroup).get('pincode').patchValue(pincode);

    }, err => {
      console.log(err);
      this._spinner.hide();
      this.toastr.error('Please enter valid GST number.','Sorry !');
    })
  };

  shipGstNum(event: any) {
    this.shipGst = event.target.value;
  };

  shipGstin(i: any) {
    this._spinner.show();
    this.productService.getMjGstIn(this.shipGst).subscribe((res: any) => {
      this._spinner.hide();
      this.toastr.success('','Success');
      let state = res.pradr.addr.stcd;
      let city = res.pradr.addr.dst;
      let pincode = res.pradr.addr.pncd;
      let addrOne = res.pradr.addr.bnm;
      let addrTwo = res.pradr.addr.st;
      let gstin = res.gstin;
      let company = res.lgnm;
      // $('#adr_'+i).val(addrOne);
      ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('company_name').patchValue(company);
      ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('addressone').patchValue(addrOne);
      ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('addresstwo').patchValue(addrTwo);
      ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('city').patchValue(city);
      ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('state').patchValue(state);
      ((this.shiptingForm.get('shipping') as FormArray).at(i) as FormGroup).get('pincode').patchValue(pincode);

    }, err => {
      console.log(err);
      this._spinner.hide();
      this.toastr.error('Please enter valid GST number.','Sorry !');
    })
  };
  useAsShippingAddr(event:any) {
    let checkValue = event.target.checked;
    if (checkValue == true) {
      $('#hideShipp').hide();
      $('#hideAddBtn').hide();
    } else {
      $('#hideShipp').show();
      $('#hideAddBtn').show();
    }
  };
  isTdsApplicable(event: any) {
    this.isTDS_applicable = event.target.checked;
  };
  
  submitRegister() {
    const fileData = new FormData();
    // this.submitted = true;
    if (!this.emailId) {
      this.toastr.error('Email required !','Opps');
      this._spinner.hide();
      this.firsttab();
      return;
    };

    if (!this.mobileNumber) {
      this.toastr.error('Mobile number required','Opps');
      this._spinner.hide();
      this.firsttab();
      return;
    };

    if (!this.password) {
      this.toastr.error('Password required','Opps');
      this._spinner.hide();
      this.firsttab();
      return;
    };
    if (!this.gstNum) {
      this.toastr.error('GST required','Opps');
      this._spinner.hide();
      this.firsttab();
      return;
    };

    // if (!this.addProof) {
    //   this.toastr.error('', 'Address proof required');
    //   this._spinner.hide();
    //   return;
    // };
    // if (!this.checkBook) {
    //   this.toastr.error('', 'Checkbook is required');
    //   this._spinner.hide();
    //   return;
    // };
    // if (!this.panCardUpload) {
    //   this.toastr.error('', 'Pan is required');
    //   this._spinner.hide();
    //   return;
    // };
    // if (!this.gstFile) {
    //   this.toastr.error('', 'GST certificate is required');
    //   this._spinner.hide();
    //   return;
    // };
    // if (!this.turnOver) {
    //   this.toastr.error('', 'Turnover-section is required');
    //   this._spinner.hide();
    //   return;
    // };
    // if (!this.itrFileUpl) {
    //   this.toastr.error('', 'ITR file is required');
    //   this._spinner.hide();
    //   return;
    // };
    // if (!this.consentFile) {
    //   this.toastr.error('', 'Consent Letter is required');
    //   this._spinner.hide();
    //   return;
    // };
    // if (!this.cerftificateUpl) {
    //   this.toastr.error('', 'Registration Certificates is required');
    //   this._spinner.hide();
    //   return;
    // };
    // if (!this.tcsUplod) {
    //   this.toastr.error('', 'TCS is required');
    //   this._spinner.hide();
    //   return;
    // }

    this.submit = true;
    let value = this.securityForm.value;

    let sequrityOne = $('#sequ1').val();
    let answOne = $('#ansOne').val();
    let sequrityTwo = $('#sequrity2').val();
    let ansTwo = $('#answ2').val();
    if(sequrityOne == '' || answOne == '' || sequrityTwo == '' || ansTwo == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Security fields are required!',
      })
      return;
    }
    if (value.securityone == value.securitytwo) {
      Swal.fire('Question selected should not match !');
      return;
    }

    this._spinner.show();
    fileData.append('user_type', btoa('C'));
    fileData.append('phone', btoa(this.mobileNumber));
    fileData.append('org_pan', btoa(this.orgPan));
    fileData.append('org_name', btoa(this.orgName));
    fileData.append('org_address',  btoa(this.orgAddrs));
    fileData.append('tcs_dt', btoa(this.isTDS_applicable));
    fileData.append('pref_product_size', btoa(this.chooseProductSize));
    fileData.append('email', btoa(this.emailId));
    fileData.append('company_gst',  btoa(this.gstNum));
    fileData.append('company_pan', btoa(this.orgPan));
    fileData.append('password', btoa(this.password));
    fileData.append('pref_product', btoa(this.chooseProduct));
    fileData.append('business_nature', btoa(this.businessType));
    fileData.append('billing_address', btoa(JSON.stringify(this.billingAdd.value)));
    fileData.append('shipping_address', btoa(JSON.stringify(this.shiptingAdd.value)));
    //FILES
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
    //DATE
    fileData.append('pan_dt', btoa(this.panDate));
    fileData.append('gst_dt', btoa(this.gstDate));
    fileData.append('formD_dt', btoa(this.formDdate));
    fileData.append('tcs_dt', btoa(this.tcsDate));

    this._auth.register(fileData).subscribe((res: any) => {
      this._spinner.hide();
      if (res.success) {
        Swal.fire({
          position: 'top',
          icon: 'success',
          text: 'Registered Successfully',
          showConfirmButton: false,
          timer: 1500
        })
        this.saveForm();
        this.checkUserExpirey();
        this._router.navigate(['/auth/login']);
        this._spinner.hide();
      }
      else if (res.error.validation?.email) {
        this.toastr.error(res.error.validation.email);
        this._spinner.hide();
      } 
      else if (res.error.validation?.company_pan.length > 0){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'GST Number already exists !',
        })
        this._spinner.hide();
        return;
      }
    },
      (error) => {
        this.toastr.error('', error);
        this._spinner.hide();
      }
    );
  };

  getQuestions() {
    this._auth.getSecurityQue().subscribe((res:any) => {
      if(res.message == 'success.') {
        this.questions = res.result;
      }
    })
  };

  checkUserExpirey() {
      let usrParam = {
        "email": this.emailId
      }
      this._auth.checkExpireyUser(usrParam).subscribe((res: any) => {
        console.log(res);
      })
  };
  
  saveForm() {
    let sequrityOne = $('#sequ1').val();
    let answOne = $('#ansOne').val();
    let sequrityTwo = $('#sequrity2').val();
    let ansTwo = $('#answ2').val();
    if(sequrityOne == '' || answOne == '' || sequrityTwo == '' || ansTwo == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Security fields are required!',
      })
      return;
    }

    let securityVal = [{
      "email": this.emailId,
      "securityone": sequrityOne,
      "answoreone": answOne
    },
    {
      "email": this.emailId,
      "securityone": sequrityTwo,
      "answoreone": ansTwo
    }]
    let passwordd = '123456';
    let encryptedd = CryptoJSAesJson.encrypt(securityVal, passwordd);
    this._auth.setSecurityQu(encryptedd).subscribe();
  };

  emailvarify(event:any) {
    this.emailId = event.target.value;
    let email = {
      "email": event.target.value
    }
    this._auth.checkEmail(email).subscribe((res:any) => {
      if(res.result == 'It looks like you already signed up, please login to your account.') {
        this.emailErr = false;
        this.emailMsg = res.result;
      } else {
        this.emailErr = true;
      }
    })
  };

  passwordCheck(pass:any) {
    var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/;
    this.errorMsg = pattern.test(pass);
    if(pattern.test(pass)){
        return true;
    } else{
        return false;
    }
  }
  
}
