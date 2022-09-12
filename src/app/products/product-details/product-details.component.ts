import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.params.subscribe(res => {
      console.log(res);
    });

    
  }

}
