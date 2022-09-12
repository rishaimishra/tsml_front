import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { ProductsModule } from '../products/products.module';

const routes: Routes = [
  {
    path: '', redirectTo: '', pathMatch: 'full',
    component: HomeComponent
  },
  // {
  //   path: ' /:Pid,/:Cid', redirectTo: '', pathMatch: 'full',
  //   component: HomeComponent
  // },
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    SharedModule,
    ProductsModule

  ]
})
export class LandingModule { }
