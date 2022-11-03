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


const routes: Routes = [
  {path: 'complains', component: ComplainsComponent, canActivate: [AuthGuard]},
  {path: 'complains-list', component: ComplainsListComponent, canActivate: [AuthGuard]},
  {path: 'complains-reply/:name', component: ComplainsReplyComponent, canActivate: [AuthGuard]},
  {path: 'kam-reply/:name', component: KamReplyComponent, canActivate: [AuthGuard]},

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
    SharedModule
  ]
})
export class ComplainsModule { }
