import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerComponent } from './manager/manager.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { SalesRfqListComponent } from './sales-rfq-list/sales-rfq-list.component';


const routes: Routes = [
  {path: 'manager/:id', component: ManagerComponent},
  {path: 'rfq-list', component: SalesRfqListComponent}
]
@NgModule({
  declarations: [
    ManagerComponent,
    SalesRfqListComponent
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
export class SalesManagerModule { }
