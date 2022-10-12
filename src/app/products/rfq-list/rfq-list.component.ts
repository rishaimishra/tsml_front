import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsService } from 'src/app/service/products.service';

@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.scss']
})
export class RfqListComponent implements OnInit {
  rfqList: any = [];
  constructor(private _products: ProductsService,
    private _spinner: NgxSpinnerService,
    private _router: Router) { }

  ngOnInit(): void {
    this._products.getAllRequestOfRfq().subscribe((res: any) => {
      console.log(res);
      if (res.status != 0) {
        this.rfqList = res.result;
      }
    }) 
  }
  goToproductDetails(rfqNo: any) {
    this._router.navigate(['/RFQ-details',rfqNo]);
  }
}
