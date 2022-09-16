import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public list: any = [];
  public product_menu_id: Number = 1;
  public product_list: any = [];
  public show_error: boolean = false;
  public popular_product_list: any = [];
  allNews: any;

  
  constructor(
    private _router: Router,
    private productService: ProductsService,
    private spinner: NgxSpinnerService,
    private _product: ProductsService
  ) {}

  ngOnInit(): void {
    this.getNews();
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 1000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
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
  }
  get_product_by_menu_id(id: any) {
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

        console.log('this.product_list=', this.product_list);
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  gotoDetailsPage(productId: any, categoryId: any) {
    this._router.navigate(['/product-details', productId, categoryId]);
  }
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
  }

  getNews() {
    this._product.getAllNews().subscribe((res: any) => {
      if (res.status == 1) {
        this.allNews = res.result;
      }
    }, (err) => {
      console.log(err)
    }
    )
  }
}
