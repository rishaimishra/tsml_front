import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy/privacy.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CookiesComponent } from './cookies/cookies.component';
import { FaqComponent } from './faq/faq.component';
import { ConnectionLostComponent } from './connection-lost/connection-lost.component';


const routes: Routes = [
  {
    path: 'privacy', 
    component: PrivacyComponent
  },
  {
    path: 'cookies', 
    component: CookiesComponent
  },
  {
    path: 'FAQ', 
    component: FaqComponent
  },
  {
    path: 'connection-lost', 
    component: ConnectionLostComponent
  },

];

@NgModule({
  declarations: [
    PrivacyComponent,
    CookiesComponent,
    FaqComponent,
    ConnectionLostComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ]
})
export class OthersModule { 

}
