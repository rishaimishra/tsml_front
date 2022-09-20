import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  public product_data: any = '';
  public show_data: boolean = false;
  public qty: Number = 1;
  public selected_size: any = '';
  public delivery_date: any = '';
  public show_error: boolean = false;
  public error_message: String = '';

  constructor(
    private _route: ActivatedRoute,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((res) => {
      console.log(res);

      this.get_product_details(res.productId, res.categoryId);
    });
  }
  get_product_details(product_id: any, category_id: any) {
    this.spinner.show();
    let url = '/product-details/' + product_id + '/' + category_id;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res);
        if (res.status == 1) {
          this.product_data = res.result;
          this.show_data = true;
        } else {
          this.product_data = '';
        }
        //console.log('this.product_data=', this.product_data);
      },
      (err) => {
        this.spinner.hide();
        // console.log(err);
      }
    );
  }
  selecte_size(size: any, index: any) {
    //console.log(size);
    //console.log('index=', index);
    this.selected_size = size;
  }
  add_to_cart(cat_id: any, product_id: any) {
    console.log('cat_id=', cat_id);
    console.log('product_id=', product_id);
    if (this.selected_size == '') {
      this.show_error = true;
      this.error_message = 'Select the size';
    } else if (this.delivery_date == '') {
      this.show_error = true;
      this.error_message = 'Enter delivery date';
    } else {
      this.show_error = false;
      this.error_message = '';
      console.log('this.selected_size=', this.selected_size);
      console.log('this.delivery_date=', this.delivery_date);
    }
    this._router.navigate(['/my-cart']);
  }
}
