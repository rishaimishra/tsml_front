import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoEntryComponent } from './do-entry/do-entry.component';
import { ViewDoComponent } from './view-do/view-do.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';


const routes: Routes = [
  {path: 'do-entry', component: DoEntryComponent},
  {path: 'do-view', component: ViewDoComponent}
]


@NgModule({
  declarations: [
    DoEntryComponent,
    ViewDoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class PlantModule { }
