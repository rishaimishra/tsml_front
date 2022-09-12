import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ferro-chrome',
  templateUrl: './ferro-chrome.component.html',
  styleUrls: ['./ferro-chrome.component.scss']
})
export class FerroChromeComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  addProduct() {
    this._router.navigate(['//add-product']);
  }
}
