import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from 'src/app/service/sales.service';

@Component({
  selector: 'app-po-status',
  templateUrl: './po-status.component.html',
  styleUrls: ['./po-status.component.scss']
})
export class PoStatusComponent implements OnInit {
  doItem:any = [];


  constructor(private _sales: SalesService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.params.subscribe((res:any) => {
      console.log(res)
      let param = {
        "cust_Referance": res.id
      }
      this._sales.veiwDOcustom(param).subscribe((res:any) => {
        console.log(res);
        if(res.message == 'success') {
         /*  res.result.forEach(element => {
            if(element.doDocument.keys() == 0)
            this.doItem = element.doDocument;
            console.log(this.doItem);
          }); */
          res.result.forEach(ele => {
            if(ele.doDocument != null){
              this.doItem = ele.doDocument;
            }
          })
          console.log("Do res",this.doItem);
        }
      })
    })
  }

}
