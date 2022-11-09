import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingModule } from './landing/landing.module';
import { AuthModule } from './auth/auth.module';
import { OthersModule } from './others/others.module';
import { ProductsModule } from './products/products.module';
import { MyaccountModule } from './myaccount/myaccount.module';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthIntercepto } from './service/auth.interceptor';
import { DatepickerModule } from 'ng2-datepicker';
import { DashboardModule } from './dashboard/dashboard.module';
import { PoModule } from './po/po.module';
import { ComplainsModule } from './complains/complains.module';
import { OrderModule } from './order/order.module';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductsModule,
    LandingModule,
    AuthModule,
    MyaccountModule,
    HttpClientModule,
    OthersModule,
    SharedModule,
    BrowserModule,
    DashboardModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    DatepickerModule,
    PoModule,
    ComplainsModule,
    OrderModule,
    NgxPaginationModule
  ],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthIntercepto, multi: true},
    Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }