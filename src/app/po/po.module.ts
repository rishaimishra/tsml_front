import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoListComponent } from './po-list/po-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoComponent } from './po/po.component';


const routes: Routes = [
  {path: 'po/:id', component: PoComponent},
  {path: 'po-list', component: PoListComponent}

];


@NgModule({
  declarations: [
    PoListComponent,
    PoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class PoModule { }
