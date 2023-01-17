import { Component, ElementRef, HostListener } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tatasteelmining';

  constructor() {
    // window.addEventListener('beforeunload', (event) => {
    //   event.returnValue = `You have unsaved changes, leave anyway?`;
    //   console.log(event);
    // });
    // var inFormOrLink;
    // $('a').on('click', function () { inFormOrLink = true; });
    // $('form').on('submit', function () { inFormOrLink = true; });

    // $(window).on("beforeunload", function () {
    //   return inFormOrLink ? "Do you really want to close?" : null;
    // })
    // console.log(inFormOrLink);
  }

}
