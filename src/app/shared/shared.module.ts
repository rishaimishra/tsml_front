import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, Routes } from '@angular/router';
import { CountToModule } from 'angular-count-to';


const routes: Routes = [
  // {
  //   path: '', 
  //   component: HeaderComponent
  // },
  // {
  //   path: '', 
  //   component: FooterComponent
  // },

];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    CountToModule,
    RouterModule.forChild(routes),
  ],
  exports: [HeaderComponent, FooterComponent]
})
export class SharedModule { }
