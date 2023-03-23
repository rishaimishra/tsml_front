import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCartComponent } from './my-cart/my-cart.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { AuthGuard } from '../auth/auth.guard';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  {
    path: 'my-cart', 
    component: MyCartComponent, canActivate: [AuthGuard]
  },
  {
    path: 'view-profile', 
    component: ViewProfileComponent, canActivate: [AuthGuard]
  },
];


@NgModule({
  declarations: [
    MyCartComponent,
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ]
})
export class MyaccountModule { }
