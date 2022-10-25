import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(window).scrollTop(0);
  }

}
