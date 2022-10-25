import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';

declare const $: any;

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {

  constructor(private _products: ProductsService,
    private _toaster: ToastrService) { }

  ngOnInit(): void {
    $(window).scrollTop(0);
  }

}
