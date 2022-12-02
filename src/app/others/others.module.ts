import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy/privacy.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CookiesComponent } from './cookies/cookies.component';
import { FaqComponent } from './faq/faq.component';


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

];

@NgModule({
  declarations: [
    PrivacyComponent,
    CookiesComponent,
    FaqComponent
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
