import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-plant-dashboard',
  templateUrl: './plant-dashboard.component.html',
  styleUrls: ['./plant-dashboard.component.scss']
})
export class PlantDashboardComponent implements OnInit {

  dashItem: any;

  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData () {
    let userId = localStorage.getItem('USER_ID');
    let params = {
      user_id: userId
    }
    this.dashboard.dashboardItem(params).subscribe((res:any) => {
      console.log(res);
      if(res.status == 1) {
        this.dashItem = res.result;
        this.dashItem.qty_despatch = this.dashItem.qty_despatch.toFixed(2);
      }
    })
  }

}
