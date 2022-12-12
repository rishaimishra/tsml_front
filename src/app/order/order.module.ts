import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPlaningFormComponent } from './order-planing-form/order-planing-form.component';
import { OrderPlaningComponent } from './order-planing/order-planing.component';
import { DailyProductionComponent } from './daily-production/daily-production.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DispatchPlanComponent } from './dispatch-plan/dispatch-plan.component';
import { SoComponent } from './so/so.component';
import { PrepareScComponent } from './prepare-sc/prepare-sc.component';
import { NgxPaginationModule } from 'ngx-pagination';


const routes: Routes = [
  {path: 'order-planing', component: OrderPlaningComponent, canActivate: [AuthGuard]},
  {path: 'order-planing-form', component: OrderPlaningFormComponent, canActivate: [AuthGuard]},
  {path: 'daily-production', component: DailyProductionComponent, canActivate: [AuthGuard]},
  {path: 'dispatch-plan', component: DispatchPlanComponent, canActivate: [AuthGuard]},
  {path: 'prepare-so', component: SoComponent, canActivate: [AuthGuard]},
  {path: 'prepare-sc', component: PrepareScComponent, canActivate: [AuthGuard]},

];

@NgModule({
  declarations: [
    OrderPlaningFormComponent,
    OrderPlaningComponent,
    DailyProductionComponent,
    DispatchPlanComponent,
    SoComponent,
    PrepareScComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class OrderModule { 

}
