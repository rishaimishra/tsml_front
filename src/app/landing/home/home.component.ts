import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public list: any = [];
  public product_menu_id: Number = 1;
  public product_list: any = [];
  public show_error: boolean = false;
  
  constructor(private _router: Router,
    private productService: ProductsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.get_product_by_menu_id(this.product_menu_id);
  }

  ngAfterViewInit() {
    this.spinner.show();
    let url = '/product-manu';
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        console.log(res);
        this.spinner.hide();
        if (res.status == 1) {
          this.list = res.result;
          // console.log('this.list=', this.list);
          this.get_product_by_menu_id(this.product_menu_id);
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }
  get_product_by_menu_id(id: any) {
    this.spinner.show();
    let url = '/index-page/' + id;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        //console.log(res);
        this.spinner.hide();
        if (res.status == 1) {
          this.product_list = res.result;
        } else {
          this.product_list = [];
          this.show_error = true;
        }

        console.log('this.product_list=', this.product_list);
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }
}
