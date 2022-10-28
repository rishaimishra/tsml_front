import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-kam-dashboard',
  templateUrl: './kam-dashboard.component.html',
  styleUrls: ['./kam-dashboard.component.scss']
})
export class KamDashboardComponent implements OnInit {
  kamItems:any;


  constructor(private dashboard: DashboardService, private spinner: NgxSpinnerService,
  private _router: Router) { }

  ngOnInit() {
    this.getKamItems();
  }


  getKamItems() {
    this.spinner.show();
    this.dashboard.getKamList().subscribe((res:any) => {
      if(res.message == 'success') {
        this.spinner.hide();
        this.kamItems = res.result;
      };
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/login']);
        this.spinner.hide();
      }

    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  }
}
