import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoEntryComponent } from './do-entry/do-entry.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { DoDetailsComponent } from './do-details/do-details.component';
import { ViewDoComponent } from './view-do/view-do.component';
import { EditDoComponent } from './edit-do/edit-do.component';


const routes: Routes = [
  {path: 'do-entry', component: DoEntryComponent},
  {path: 'do-list', component: ViewDoComponent},
  {path: 'do-details/:id', component: DoDetailsComponent},
  {path: 'edit-do/:id', component: EditDoComponent},
]


@NgModule({
  declarations: [
    DoEntryComponent,
    ViewDoComponent,
    DoDetailsComponent,
    EditDoComponent
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
