import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/service/products.service';
import { StateCityService } from 'src/app/service/state-city.service';

declare const $: any;

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  holdRfqNumber: string;


  constructor(private _products: ProductsService,
    private _toaster: ToastrService, private _state: StateCityService) { }

  ngOnInit(): void {
    $(window).scrollTop(0);

    this._state.receiveRfqNumer().subscribe((data:any) => {
      this.holdRfqNumber = data;
    })
  }

}
