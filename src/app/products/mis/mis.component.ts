import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/service/products.service';
import { SalesService } from 'src/app/service/sales.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mis',
  templateUrl: './mis.component.html',
  styleUrls: ['./mis.component.scss']
})
export class MisComponent implements OnInit {

  misForm: FormGroup;
  misData: any;
  p: number = 1;
  excelExp = environment.apiEndpointBase;
  material: any;
  cities: any;
  plants: any;

  constructor(private products: ProductsService, private _fb: FormBuilder, private _spinner: NgxSpinnerService,
      private sales: SalesService) {
    this.misForm = this._fb.group({
      plant: [''],
      location: [''],
      sku: ['']
    })
   }

  ngOnInit(): void {
    this.getDropdownValues()
    this.getMisData();
  }

  getDropdownValues() {
    this.sales.getMaterial().subscribe((res:any) => {
      if(res.message == 'success') {
        this.material = res.result;
      }
    });
    this.sales.getCity().subscribe((res:any) => {
      if(res.message == 'success') {
        this.cities = res.result;
      }
    });
    this.sales.getPlant().subscribe((res:any) => {
      if(res.message == 'success') {
        this.plants = res.result;
      }
    });
    console.log(this.material);

  }

  getMisData() {
    this._spinner.show();
    this.products.getMisSalesData(this.misForm.value).subscribe((res: any) => {
      if (res.status != 0) {
        this.misData = res.result;
        this._spinner.hide();
      }
      if (res.status == 'Token has Expired') {
      }
    }) 
  }

  searchMsi() {
    this._spinner.show();
    console.log(this.misForm.value);
    this.products.getMisSalesData(this.misForm.value).subscribe((res: any) => {
      if (res.status != 0) {
       console.log(res);
       this.misData = res.result;
       this._spinner.hide();
      }
      if (res.status == 'Token has Expired') {
      
      }
    })
  }

}
