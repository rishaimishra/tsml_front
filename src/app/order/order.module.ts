import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPlaningFormComponent } from './order-planing-form/order-planing-form.component';
import { OrderPlaningComponent } from './order-planing/order-planing.component';
import { DailyProductionComponent } from './daily-production/daily-production.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {path: 'order-planing', component: OrderPlaningComponent, canActivate: [AuthGuard]},
  {path: 'order-planing-form', component: OrderPlaningFormComponent, canActivate: [AuthGuard]},
  {path: 'daily-production', component: DailyProductionComponent, canActivate: [AuthGuard]},

];

@NgModule({
  declarations: [
    OrderPlaningFormComponent,
    OrderPlaningComponent,
    DailyProductionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class OrderModule { }