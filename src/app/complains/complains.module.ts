import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplainsComponent } from './complains/complains.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { ComplainsListComponent } from './complains-list/complains-list.component';
import { ComplainsReplyComponent } from './complains-reply/complains-reply.component';
import { KamReplyComponent } from './kam-reply/kam-reply.component';
import { NgxPaginationModule } from 'ngx-pagination';


const routes: Routes = [
  {path: 'complaints', component: ComplainsComponent, canActivate: [AuthGuard]},
  {path: 'complaints-list', component: ComplainsListComponent, canActivate: [AuthGuard]},
  {path: 'complaints-reply/:id', component: ComplainsReplyComponent, canActivate: [AuthGuard]},
  {path: 'kam-reply/:id', component: KamReplyComponent, canActivate: [AuthGuard]},

];


@NgModule({
  declarations: [
    ComplainsComponent,
    ComplainsListComponent,
    ComplainsReplyComponent,
    KamReplyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class ComplainsModule {

 }
