import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PrepareScComponent } from './prepare-sc/prepare-sc.component';
import { AuthGuard } from '../auth/auth.guard';
import { PrepareSoComponent } from './prepare-so/prepare-so.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { UpdateInfoComponent } from './update-info/update-info.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ViewScComponent } from './view-sc/view-sc.component';


const routes: Routes = [
  {
    path: 'prepare-sc', 
    component: PrepareScComponent
  },
  {
    path: 'prepare-so', 
    component: PrepareSoComponent
  },
  {
    path: 'update-info', 
    component: UpdateInfoComponent
  },
  {
    path: 'view-sc/:id', 
    component: ViewScComponent
  },
];

@NgModule({
  declarations: [
    PrepareScComponent,
    PrepareSoComponent,
    UpdateInfoComponent,
    ViewScComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild(routes),
    FormsModule,
    AutocompleteLibModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class SalesModule { }
