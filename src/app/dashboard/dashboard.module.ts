import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { KamDashboardComponent } from './kam-dashboard/kam-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';


const routes: Routes = [
  {path: 'customer-dashboard', component: CustomerDashboardComponent},
  {path: 'kam-dashboard', component: KamDashboardComponent},
  {path: 'sales-dashboard', component: SalesDashboardComponent}

]


@NgModule({
  declarations: [
    CustomerDashboardComponent,
    KamDashboardComponent,
    SalesDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxPaginationModule
  ]
})
export class DashboardModule { }
