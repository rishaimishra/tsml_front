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
import { ViewAllProductComponent } from './view-all-product/view-all-product.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { RfqListComponent } from './rfq-list/rfq-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { RfqDetailsComponent } from './rfq-details/rfq-details.component';
import { KamComponent } from './kam/kam.component';
import { TruncatePipe } from './transform.pipe';
import { CustomerComponent } from './customer/customer.component';


const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent,
  },
  {
    path: 'ferro-chrome',
    component: FerroChromeComponent,
  },
  {
    path: 'chrome-ore',
    component: ChromeOreComponent,
  },
  {
    path: 'product-details',
    component: ProductDetailsComponent,
  },
  {
    path: 'product-details/:productId/:categoryId',
    component: ProductDetailsComponent,
  },
  {
    path: 'edit-FRQ',
    component: EditFRQComponent,canActivate: [AuthGuard],
  },
  {
    path: 'add-product',
    component: AddProductComponent,canActivate: [AuthGuard],
  },
  {
    path: 'all-product',
    component: ViewAllProductComponent,
  },
  {
    path: 'thank-you',
    component: ThankYouComponent,canActivate: [AuthGuard],
  },
  {
    path: 'rfq-list',
    component: RfqListComponent,canActivate: [AuthGuard],
  },
  {
    path: 'RFQ-details/:RFQ',
    component: RfqDetailsComponent,canActivate: [AuthGuard],
  },
  {
    path: 'kam/:id',
    component: KamComponent,canActivate: [AuthGuard],
  },
  {
    path: 'customer/:id',
    component: CustomerComponent,canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    OverviewComponent,
    FerroChromeComponent,
    ChromeOreComponent,
    ProductDetailsComponent,
    EditFRQComponent,
    AddProductComponent,
    ViewAllProductComponent,
    ThankYouComponent,
    RfqListComponent,
    RfqDetailsComponent,
    KamComponent,
    TruncatePipe,
    CustomerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
  ],
})
export class ProductsModule {}
