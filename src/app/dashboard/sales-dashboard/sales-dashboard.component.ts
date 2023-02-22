import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { DashboardService } from 'src/app/service/dashboard.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent implements OnInit {
  userType: boolean;
  dashItem: any;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart1") chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  


  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    let userRol = localStorage.getItem('USER_TYPE');
    if(userRol == 'Kam') {
      this.userType = false;

    } else {
      this.userType = true;

    }
    this.getDashboardValue();
  };

  getDashboardValue () {
    let userId = localStorage.getItem('USER_ID');
    let params = {
      user_id: userId
    }
    this.dashboard.dashboardItem(params).subscribe((res:any) => {
      if(res.status == 1) {
        this.dashItem = res.result;
        this.chartOne();
        this.chartTwo();
      }
    })
  };

  chartOne () {
    this.chartOptions = {
      series: [this.dashItem?.DAP_confirmed_orders, this.dashItem?.ex_Depot_confirmed_orders, this.dashItem?.ex_plant_confirmed_orders],
      chart: {
        width: 450,
        type: "pie"
      },
      labels: ["DAP", "EX-Depot", "EX-Plant"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "buttom"
            }
          }
        }
      ]
    };
  };

  chartTwo () {
    let dapval = this.dashItem?.DAP_con_orders_chrt_mon;
    let exDepot = this.dashItem?.ex_Depot_con_orders_chrt_mon;
    let exPlant = this.dashItem?.ex_plant_con_orders_chrt_mon;

    this.chartOptions1 = {
      series: [dapval, exDepot, exPlant],
      chart: {
        width: 450,
        type: "pie"
      },
      
      labels: ["DAP MT", "EX-Depot MT", "EX-Plant MT"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "buttom"
            }
          }
        }
      ]
    };
  }
}
