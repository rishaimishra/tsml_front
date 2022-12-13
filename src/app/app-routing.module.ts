import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = 
[
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
  },
  {
    path: 'complains',
    loadChildren: () => import('./complains/complains.module').then(m => m.ComplainsModule),
  },
  {
    path: 'po',
    loadChildren: () => import('./po/po.module').then(m => m.PoModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'others',
    loadChildren: () => import('./others/others.module').then(m => m.OthersModule),
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
  },
  {
    path: 'myaccount',
    loadChildren: () => import('./myaccount/myaccount.module').then(m => m.MyaccountModule),
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
