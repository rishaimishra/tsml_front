import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';
import { ProductsService } from 'src/app/service/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isUserLogin: any;
  public list: any = [];
  public product_menu_id: Number = 1;
  public product_list: any = [];
  public show_error: boolean = false;
  public popular_product_list: any = [];
  allNews: any;
  menuId: any;
  isLogin:boolean;
  categoryOne:any;
  categoryTwo:any;
  imageUrl:any;


  constructor(
    private _router: Router,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _product: ProductsService,
    private _auth: AuthService
  ) 
  { 
    this.isLogin = this._auth.isLoggedIn();

  }

  ngOnInit(): void {
    this.isUserLogin = this._auth.isLoggedIn();
    this.getProducts();
  }

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: false,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    navSpeed: 1000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 4,
      },
      740: {
        items: 4,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };

  ngAfterViewInit() {
    this.spinner.show();
    let url = '/product-manu';
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status == 1) {
          this.list = res.result;
          this.get_product_by_menu_id(this.product_menu_id);
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
    this.get_popular_product();
  };
  get_product_by_menu_id(id: any) {
    this.menuId = id;
    this.spinner.show();
    let url = '/index-page/' + id;
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status == 1) {
          this.product_list = res.result;

        } else {
          this.product_list = [];
          this.show_error = true;
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  };
  isActive(item: any) {
    return this.menuId === item;
  };
  
  get_popular_product() {
    let url = '/popular-product';
    this.productService.getMethod(url).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.popular_product_list = res.result;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  gotoDetailsPage(productId: any, categoryId: any) {
    if (this.isLogin == true) {
      this._router.navigate(['/products/product-details', productId, categoryId]);
    } else {
      this._router.navigate(['/auth/login']);
    }
  };

  getProducts() {
    let apiurl = '/product-related-category-fetch';
    this._product.getMethod(apiurl).subscribe((res:any) => {
      if (res.success == true) {
        this.categoryOne = res.product_one_category;
        this.categoryTwo = res.product_two_category;
        this.imageUrl = res.image_url;
      }
    }, error => {
      console.log(error);
    })
  }
}
