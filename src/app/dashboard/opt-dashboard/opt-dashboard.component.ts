import { Component, OnInit, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexMarkers,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexFill
} from "ng-apexcharts";
import { DashboardService } from 'src/app/service/dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  colors: string[];
  markers: ApexMarkers;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  labels: any;
};


@Component({
  selector: 'app-opt-dashboard',
  templateUrl: './opt-dashboard.component.html',
  styleUrls: ['./opt-dashboard.component.scss']
})
export class OptDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart") chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  dashItem:any = [];
  undrnego:any;
  exPlantConf:any;
  exDepotConf:any;
  dapConf:any;
  volConfm:any;



  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
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
        this.piechart1();
        this.piechart();
      }
    })
  };

  piechart1() {
    var options = {
      series: [44, 55, 13],
      chart: {
        width: 450,
        type: 'pie',
      },
      labels: ["DAP","EX Depot", "Ex Plant",],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 450
          },
          legend: {
            position: 'top'
          },
          toolbar: {
            show: true
          }
        }
      }]
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  };

  piechart() {
    var options = {
      series: [44, 55, 100],
      chart: {
        width: 450,
        type: 'pie',
      },
      // labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      labels: ["DAP",'Ex Depot', 'Ex Plant'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 450
          },
          legend: {
            position: 'top'
          },
          toolbar: {
            show: true
          }
        }
      }]
    };

    var chart = new ApexCharts(document.querySelector("#chart1"), options);
    chart.render();
  }

}
