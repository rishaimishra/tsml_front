import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-view-all-product',
  templateUrl: './view-all-product.component.html',
  styleUrls: ['./view-all-product.component.scss']
})
export class ViewAllProductComponent implements OnInit {
  allProductItem: any;
  categoryList: any;
  products: any;
  subCategory: any;
  productSize: any = [];
  category:any;


  constructor(private _product: ProductsService,
    private _loader: NgxSpinnerService,
    private _router: Router) { }

  ngOnInit(): void {
    this.showAllProducts();
  }

  gotoDetailsPage(productId: any, categoryId: any) {
    this._router.navigate(['/product-details', productId, categoryId]);
  }
  clreaFilter() {
    this.showAllProducts();
  }
  showAllProducts() {
    this._loader.show();
    this._product.getAllProducts().subscribe((res: any) => {
      if (res.success == true) {
        this.allProductItem = res.data;
        this.categoryList = res.getCategory;
        this.products = res.getProductList;
        this._loader.hide();
      }
    }, err => {
      console.log(err);
      this._loader.hide();
    })
  }

  getCategory(event: any) {
    this._loader.show();
    let categoryFilter = {
      cat_id: event.target.value
    }
    this._product.filterProducts(categoryFilter).subscribe((res: any) => {
      if (res.success == true) {
        this.subCategory = res.subCategories;
        this.allProductItem = res.data;
        this._loader.hide();
      }
    }, err => {
      console.log(err);
      this._loader.hide();
    })
  };

  selectSubCategory(event: any) {
    this._loader.show();
    let sizeFilter = {
      subcat_id: event.target.value,
    }
    this._product.filterProducts(sizeFilter).subscribe((res: any) => {
      if (res.success == true) {
        this.subCategory = res.subCategories;
        this.allProductItem = res.data;
        this._loader.hide();
      }
    }, err => {
      console.log(err);
      this._loader.hide();
    })
  }
  productList(event: any) {
    this._loader.show();
    let sizeFilter = {
      product_id: event.target.value,
    }
    this._product.filterProducts(sizeFilter).subscribe((res: any) => {
      if (res.success == true) {
        this.category = res.getCategory;
        this.allProductItem = res.data;
        this._loader.hide();
      }
    }, err => {
      console.log(err);
      this._loader.hide();
    })
  };

  selectSize(event: any) {
    this._loader.show();
    const productValue = event.target.value;
    this.productSize.push(productValue);
    let sizeFilter = {
      prosize: this.productSize
    }
    this._product.filterProducts(sizeFilter).subscribe((res: any) => {
      if (res.success == true) {
        this.subCategory = res.subCategories;
        this.allProductItem = res.data;
        this._loader.hide();
      }
    }, err => {
      console.log(err);
      this._loader.hide();
    })
  }
}
