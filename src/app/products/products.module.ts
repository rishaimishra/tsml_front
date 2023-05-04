import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChromeOreComponent } from './chrome-ore/chrome-ore.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditFRQComponent } from './edit-frq/edit-frq.component';
import { SharedModule } from '../shared/shared.module';
import { ViewAllProductComponent } from './view-all-product/view-all-product.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { RfqListComponent } from './rfq-list/rfq-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { RfqDetailsComponent } from './rfq-details/rfq-details.component';
import { KamComponent } from './kam/kam.component';
import { TruncatePipe } from './transform.pipe';
import { CustomerComponent } from './customer/customer.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmRfqComponent } from './confirm-rfq/confirm-rfq.component';
import { SalesResponsComponent } from './sales-respons/sales-respons.component';
import { SalesGuard } from '../Guard/sales.guard';
import { CustGuard } from '../Guard/cust.guard';
import { KamGuard } from '../Guard/kam.guard';
import { MisComponent } from './mis/mis.component';


const routes: Routes = [
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
    path: 'all-product',
    component: ViewAllProductComponent,
  },
  {
    path: 'all-product/:id',
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
    path: 'customer/:id',
    component: CustomerComponent,canActivate: [CustGuard],
  },
  {
    path: 'cam/:id',
    component: KamComponent,canActivate: [KamGuard],
  },
  {
    path: 'confirm-rfq/:id',
    component: ConfirmRfqComponent,canActivate: [SalesGuard],
  },
  {
    path: 'confirm-rfq',
    component: ConfirmRfqComponent,canActivate: [SalesGuard],
  },
  {
    path: 'sales-respons/:id',
    component: SalesResponsComponent,canActivate: [SalesGuard],
  },
  {
    path: 'mis',
    component: MisComponent,canActivate: [SalesGuard],
  },
];

@NgModule({
  declarations: [
    ChromeOreComponent,
    ProductDetailsComponent,
    EditFRQComponent,
    ViewAllProductComponent,
    ThankYouComponent,
    RfqListComponent,
    RfqDetailsComponent,
    KamComponent,
    TruncatePipe,
    CustomerComponent,
    ConfirmRfqComponent,
    SalesResponsComponent,
    MisComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    NgxPaginationModule,
  ],
})
export class ProductsModule {

}
