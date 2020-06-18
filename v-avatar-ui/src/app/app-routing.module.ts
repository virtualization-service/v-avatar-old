import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NewTrainingComponent } from './trainings/new-training/new-training.component';
import { ViewTrainingComponent } from './trainings/view-training/view-training.component';
import { PriotizeTrainingComponent } from './trainings/priotize-training/priotize-training.component';
import { ConfigureTrainingComponent } from './trainings/configure-training/configure-training.component';

const routes: Routes = [
  { path: '', component: ViewTrainingComponent },
  { path: 'new-training', component: NewTrainingComponent, canActivate: [AuthGuard] },
  { path: 'view-training', component: ViewTrainingComponent, canActivate: [AuthGuard] },
  { path: 'priotize-training', component: PriotizeTrainingComponent, canActivate: [AuthGuard] },
  { path: 'configure-training', component: ConfigureTrainingComponent, canActivate: [AuthGuard] },
  { path: 'edit/:trainingId', component: PriotizeTrainingComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
