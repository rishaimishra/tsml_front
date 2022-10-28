import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { KamDashboardComponent } from './kam-dashboard/kam-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {path: 'customer-dashboard', component: CustomerDashboardComponent},
  {path: 'kam-dashboard', component: KamDashboardComponent}

]


@NgModule({
  declarations: [
    CustomerDashboardComponent,
    KamDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
  ]
})
export class DashboardModule { }
