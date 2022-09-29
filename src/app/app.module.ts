import { NgModule } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';



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
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
  ],
  exports: [RouterModule],
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }