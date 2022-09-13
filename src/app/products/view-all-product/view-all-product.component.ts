import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-view-all-product',
  templateUrl: './view-all-product.component.html',
  styleUrls: ['./view-all-product.component.scss']
})
export class ViewAllProductComponent implements OnInit {

  constructor(private _product: ProductsService) { }

  ngOnInit(): void {
  }

  // showAllProducts() {
  //   this._product.viewAllProduct().subscribe(res => {
  //     console.log(res)
  //   })
  // }
}
