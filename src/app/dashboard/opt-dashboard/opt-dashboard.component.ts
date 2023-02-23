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

  
  constructor() { }

  ngOnInit(): void {
    this.piechart1();
    this.piechart();
  }

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
  }

  piechart() {
    var options = {
      series: [44, 55, 100],
      chart: {
        width: 470,
        type: 'pie',
      },
      // labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      labels: ["DAP",'Ex Depot', 'Ex Plant'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 470
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
