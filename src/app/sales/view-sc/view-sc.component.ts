import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SalesService } from 'src/app/service/sales.service';
declare var $: any;


@Component({
  selector: 'app-view-sc',
  templateUrl: './view-sc.component.html',
  styleUrls: ['./view-sc.component.scss']
})
export class ViewScComponent implements OnInit {
  viewdata: any;
  constructor(private _sales: SalesService,
    private _spiner: NgxSpinnerService,
    private _route: ActivatedRoute,) { }

  ngOnInit(): void {
    this._spiner.show();
    this._route.params.subscribe((res: any) => {
      let apiUrl = '/user/view_sc/' + res.id
      this._sales.getMethod(apiUrl).subscribe((res: any) => {
        this._spiner.hide();
        if (res.message == 'success') {
          this.viewdata = res.result;
        }
      })
    }, err => {
      console.log(err);
      this._spiner.hide();
    })
  }
  
}
