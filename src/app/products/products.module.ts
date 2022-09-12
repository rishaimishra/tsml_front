import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { FerroChromeComponent } from './ferro-chrome/ferro-chrome.component';
import { ChromeOreComponent } from './chrome-ore/chrome-ore.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditFRQComponent } from './edit-frq/edit-frq.component';
import { AddProductComponent } from './add-product/add-product.component';
import { SharedModule } from '../shared/shared.module';
import { LandingModule } from '../landing/landing.module';


const routes: Routes = [
  {
    path: 'overview', 
    component: OverviewComponent
  },
  {
    path: 'ferro-chrome', 
    component: FerroChromeComponent,
  },
  {
    path: 'chrome-ore', 
    component: ChromeOreComponent
  },
  {
    path: 'product-details', 
    component: ProductDetailsComponent,
  },
  {
    path: 'product-details/:productId,/:categoryId', 
    component: ProductDetailsComponent,
  },
  {
    path: 'edit-FRQ', 
    component: EditFRQComponent,
  },
  {
    path: 'add-product', 
    component: AddProductComponent,
  }
];

@NgModule({
  declarations: [
    OverviewComponent,
    FerroChromeComponent,
    ChromeOreComponent,
    ProductDetailsComponent,
    EditFRQComponent,
    AddProductComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ]
})
export class ProductsModule { }
