import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ProductsService } from 'src/app/service/products.service';
import { CryptoJSAesJson } from 'src/assets/js/cryptojs-aes-format.js';
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
  selector: 'app-kam-dashboard',
  templateUrl: './kam-dashboard.component.html',
  styleUrls: ['./kam-dashboard.component.scss']
})
export class KamDashboardComponent implements OnInit {
  kamItems: any;
  poItems: any;
  userName: any;
  p: number = 1;
  d: number = 1;
  statusRfq: any = [];

  searchValue: any;
  searchPoValue: any;
  dashItem: any;
  keys:any = [];
  keysValue:any = [];

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart") chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;

  constructor(private dashboard: DashboardService, private spinner: NgxSpinnerService,
    private _router: Router, private _product: ProductsService) { }

  ngOnInit() {
    this.userName = localStorage.getItem('USER_NAME');
    this.getKamItems();
    this.getKamPoListing();
    this.getDashboardValue();
  };

  poSearch() {
    this.spinner.show();
    let poValReq = {
      "search_txt": this.searchPoValue
    }
    this._product.searchPo(poValReq).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1) {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.poItems = decrypted;
      }
    })
  }
  seacrhByrfq() {
    this.spinner.show();
    let searchRequest = {
      "rfq_no": this.searchValue
    }
    this._product.searchRfq(searchRequest).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1) {
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.kamItems = decrypted;
      }
    })
  };

  reedirectPage(status: any, rfqNumber: any, kamStatus: any) {
    let rfqNo = btoa(rfqNumber);
    let userType = localStorage.getItem('USER_TYPE');
    if (status == 'Accepted' && kamStatus != 4) {
      this._router.navigate(['/po/po', rfqNo]);
    }
    else if (kamStatus == 4) {
      this._router.navigate(['/po/po-list'])
    }
    else if (userType == 'C') {
      this._router.navigate(['/products/customer', rfqNo]);
    }
    else {
      this._router.navigate(['/products/cam', rfqNo]);
    }
  };

  getKamItems() {
    this.searchValue = '';
    // this.spinner.show();
    this.dashboard.getKamList().subscribe((res: any) => {
      this.spinner.hide();
      if (res.message == 'success') {
        this.spinner.hide();
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.kamItems = decrypted;
        const rfqNum = [];
        for (let i = 0; i < this.kamItems.length; i++) {
          let rfqNumbr = this.kamItems[i]['rfq_no'];
          rfqNum.push(rfqNumbr);
        }
        this.getRfqStatus(rfqNum);
      };
      if (res.status == 'Token has Expired') {
        this._router.navigate(['/auth/login']);
        this.spinner.hide();
      }

    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  getRfqStatus(rfqNumbr: any) {
    // this.spinner.show();
    let request = {
      "rfq_no": rfqNumbr
    }
    this._product.getRfqStatusKam(request).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 1) {
        // let password = '123456';
        // let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.statusRfq = res.result;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  getKamPoListing() {
    this.searchPoValue = '';
    // this.spinner.show();
    this._product.getkamPoList().subscribe((res: any) => {
      this.spinner.hide();
      if (res?.message == 'success') {
        this.spinner.hide();
        let password = '123456';
        let decrypted = CryptoJSAesJson.decrypt(res.result, password);
        this.poItems = decrypted;
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
    })
  };

  getDashboardValue() {
    let userId = localStorage.getItem('USER_ID');
    let params = {
      user_id: userId
    }
    this.dashboard.dashboardItem(params).subscribe((res: any) => {
      if (res.status == 1) {
        this.dashItem = res.result;
        console.log(this.dashItem)
        this.barchart();
        this.piechart();
      }
    })
  };

  redirectPo(poNum: any) {
    let rfqNo = btoa(poNum);
    this._router.navigate(['/po/po-view', rfqNo])
  };


  barchart() {
    var options = {
      series: [{
        name: 'Month',
        type: 'column',
        data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
      }, {
        name: 'Revenues',
        type: 'line',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
      }],
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: 'Monthly Volume Graph with average Net Price Realization'
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
      xaxis: {
        type: 'datetime'
      },
      yaxis: [{
        title: {
          text: '',
        },

      }, {
        opposite: true,
        title: {
          text: ''
        }
      }]
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  };

  piechart() {
    let keysval = Object.keys(this.dashItem.top_five_cust_sale);
    let keys = Object.values(this.dashItem.top_five_cust_sale);
    this.keys.push(keysval);
    this.keysValue.push(keys);

    var options = {
      series: this.keysValue[0],
      chart: {
        width: 550,
        type: 'pie',
      },

      labels: this.keys[0],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 550
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
