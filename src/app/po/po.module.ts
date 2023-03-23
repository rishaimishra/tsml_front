import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoListComponent } from './po-list/po-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoComponent } from './po/po.component';
import { PoEditComponent } from './po-edit/po-edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { PoViewComponent } from './po-view/po-view.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PoStatusComponent } from './po-status/po-status.component';


const routes: Routes = [
  {path: 'po/:id', component: PoComponent, canActivate: [AuthGuard]},
  {path: 'po-list', component: PoListComponent, canActivate: [AuthGuard]},
  {path: 'po-edit/:id', component: PoEditComponent, canActivate: [AuthGuard]},
  {path: 'po-view/:id', component: PoViewComponent, canActivate: [AuthGuard]},
  {path: 'po-status/:id', component: PoStatusComponent, canActivate: [AuthGuard]}

];


@NgModule({
  declarations: [
    PoListComponent,
    PoComponent,
    PoEditComponent,
    PoViewComponent,
    PoStatusComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    NgxPaginationModule
  ],
  exports: [RouterModule]
})
export class PoModule {

 }
