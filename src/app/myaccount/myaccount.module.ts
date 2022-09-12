import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  {
    path: 'profile', 
    component: ProfileComponent, canActivate: [AuthGuard]
  },
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
    ProfileComponent,
    MyCartComponent,
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
  ]
})
export class MyaccountModule { }
