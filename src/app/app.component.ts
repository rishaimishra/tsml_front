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
    //   console.log('Logout');
    // });

    
  }

}
