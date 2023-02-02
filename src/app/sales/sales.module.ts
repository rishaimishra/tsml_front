import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PrepareScComponent } from './prepare-sc/prepare-sc.component';
import { AuthGuard } from '../auth/auth.guard';
import { PrepareSoComponent } from './prepare-so/prepare-so.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { UpdateInfoComponent } from './update-info/update-info.component';


const routes: Routes = [
  {
    path: 'prepare-sc', 
    component: PrepareScComponent
  },
  {
    path: 'prepare-so', 
    component: PrepareSoComponent
  },
  {
    path: 'update-info', 
    component: UpdateInfoComponent
  }
];

@NgModule({
  declarations: [
    PrepareScComponent,
    PrepareSoComponent,
    UpdateInfoComponent
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
