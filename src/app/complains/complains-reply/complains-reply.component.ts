import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-complains-reply',
  templateUrl: './complains-reply.component.html',
  styleUrls: ['./complains-reply.component.scss']
})
export class ComplainsReplyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const usrName:any = localStorage.getItem('USER_NAME');
    alert(usrName);
  }

}
