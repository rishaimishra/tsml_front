import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PrepareScComponent } from './prepare-sc/prepare-sc.component';
import { AuthGuard } from '../auth/auth.guard';
import { PrepareSoComponent } from './prepare-so/prepare-so.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  {
    path: 'prepare-sc', 
    component: PrepareScComponent, canActivate: [AuthGuard]
  },
  {
    path: 'prepare-so', 
    component: PrepareSoComponent, canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    PrepareScComponent,
    PrepareSoComponent
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
export class SalesModule { }
