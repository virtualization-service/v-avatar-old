import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NewTrainingComponent } from './trainings/new-training/new-training.component';
import { ViewTrainingComponent } from './trainings/view-training/view-training.component';
import { PriotizeTrainingComponent } from './trainings/priotize-training/priotize-training.component';
import { ConfigureTrainingComponent } from './trainings/configure-training/configure-training.component';

const routes: Routes = [
  { path: '', component: ViewTrainingComponent },
  { path: 'new-training', component: NewTrainingComponent },
  { path: 'view-training', component: ViewTrainingComponent },
  { path: 'priotize-training', component: PriotizeTrainingComponent },
  { path: 'configure-training', component: ConfigureTrainingComponent },
  { path: 'edit/:trainingId', component: PriotizeTrainingComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
