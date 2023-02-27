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
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart1") chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;

  dashItem: any;
  undrnego:any;
  exPlantConf:any;
  exDepotConf:any;
  dapConf:any;
  volConfm:any;

  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {

    let userId = localStorage.getItem('USER_ID');
    let params = {
      user_id: userId
    }
    this.dashboard.dashboardItem(params).subscribe((res: any) => {
      if (res.status == 1) {
        this.dashItem = res.result;
        function removeTrailingZeros(num:any, decimals:any) {
          const number = String(num).replace(/\.0+$/, '');
          return parseFloat(number).toFixed(decimals);
        }
        let valuConfrm = removeTrailingZeros(this.dashItem.volumeconfirmed, 0);
        this.volConfm = valuConfrm;
        this.undrnego = this.dashItem.volume_under_negotiation;
        this.exPlantConf = this.dashItem?.ex_plant_confirmed_orders;
        this.exDepotConf = this.dashItem?.ex_Depot_confirmed_orders;
        this.dapConf = this.dashItem?.DAP_confirmed_orders;
        this.chartOne();
        this.chartTwo();
      }
    })

  };

  chartOne () {
    let keysValue =[];
    let dap = this.dashItem['DAP_confirmed_orders'];
    let ex_depot = this.dashItem['ex_Depot_confirmed_orders'];
    let ex_plant = this.dashItem['ex_plant_confirmed_orders'];
    let keys = Object.values(this.dashItem);
    keysValue.push(keys);
    let yearValu = keysValue[0];

    this.chartOptions = {
      series: [dap, ex_depot, ex_plant],
      chart: {
        width: 450,
        type: "pie"
      },
     labels: ["DAP - "+yearValu[7]+' '+'MT', "EX-Depot - "+yearValu[6]+' '+'MT', "EX-Plant - "+yearValu[5]+' '+'MT'],
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
    let keysValue =[];
    let dapval = this.dashItem?.DAP_con_orders_chrt_mon;
    let exDepot = this.dashItem?.ex_Depot_con_orders_chrt_mon;
    let exPlant = this.dashItem?.ex_plant_con_orders_chrt_mon;
    let keys = Object.values(this.dashItem);
    keysValue.push(keys);
    let monthlyVal = keysValue[0];

    this.chartOptions1 = {
      series: [dapval, exDepot, exPlant],
      chart: {
        width: 450,
        type: "pie"
      },
      
      labels: ["DAP - "+monthlyVal[4]+' '+'MT', "EX-Depot - "+monthlyVal[3]+' '+'MT', "EX-Plant - "+monthlyVal[2]+' '+'MT'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 350
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
