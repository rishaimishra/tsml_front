import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { KamDashboardComponent } from './kam-dashboard/kam-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  {path: 'customer-dashboard', component: CustomerDashboardComponent, canActivate: [AuthGuard]},
  {path: 'kam-dashboard', component: KamDashboardComponent, canActivate: [AuthGuard]},
  {path: 'sales-dashboard', component: SalesDashboardComponent, canActivate: [AuthGuard]}

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
