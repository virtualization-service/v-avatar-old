import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NewTrainingComponent } from './new-training/new-training.component';
import { AngularMaterialModule } from '../angular-meterial.module';
import { PriotizeTrainingComponent } from './priotize-training/priotize-training.component';
import { ConfigureTrainingComponent } from './configure-training/configure-training.component';
import { ViewTrainingComponent } from './view-training/view-training.component';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@NgModule({
  declarations: [
    NewTrainingComponent,
    PriotizeTrainingComponent,
    ConfigureTrainingComponent,
    ViewTrainingComponent,
    MessageDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class TrainingModule {}
