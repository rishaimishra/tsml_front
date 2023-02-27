import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { KamDashboardComponent } from './kam-dashboard/kam-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SalesGuard } from '../Guard/sales.guard';
import { KamGuard } from '../Guard/kam.guard';
import { CustGuard } from '../Guard/cust.guard';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { PlantDashboardComponent } from './plant-dashboard/plant-dashboard.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { OptDashboardComponent } from './opt-dashboard/opt-dashboard.component';
import { OptGuard } from '../Guard/opt.guard';
import { ManagerGuard } from '../Guard/manager.guard';
import { PlantGuard } from '../Guard/plant.guard';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CountToModule } from 'angular-count-to';



const routes: Routes = [
  {path: 'customer-dashboard', component: CustomerDashboardComponent, canActivate: [CustGuard]},
  {path: 'kam-dashboard', component: KamDashboardComponent, canActivate: [KamGuard]},
  {path: 'sales-dashboard', component: SalesDashboardComponent, canActivate: [SalesGuard]},
  {path: 'manager-dashboard', component: ManagerDashboardComponent, canActivate: [ManagerGuard]},
  {path: 'plant-dashboard', component: PlantDashboardComponent, canActivate: [PlantGuard]},
  {path: 'opt-dashboard', component: OptDashboardComponent, canActivate: [OptGuard]}

]


@NgModule({
  declarations: [
    CustomerDashboardComponent,
    KamDashboardComponent,
    SalesDashboardComponent,
    ManagerDashboardComponent,
    PlantDashboardComponent,
    OptDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    CountToModule,
    NgApexchartsModule,
    NgxPaginationModule,
    MatPaginatorModule
  ]
})
export class DashboardModule { 

}
