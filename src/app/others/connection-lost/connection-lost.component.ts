import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-connection-lost',
  templateUrl: './connection-lost.component.html',
  styleUrls: ['./connection-lost.component.scss']
})
export class ConnectionLostComponent implements OnInit {
  onlineMessage:any;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.createOnline$().subscribe((isOnline) => {
      if (isOnline) {
        this.onlineMessage = 'You are connected to internet';
        this._router.navigate(['/']);
      } else {
        this.onlineMessage =
          'Connection lost, Please check your internet connection.';
          // window.confirm("Connection lost, Please check your internet connection.");
      }
    });
  }

  createOnline$() {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }
}
