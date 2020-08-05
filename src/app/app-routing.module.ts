import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {CarreraComponent} from './carrera/carrera.component';
import {PlanComponent} from './plan/plan.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: ':carrera', component: CarreraComponent},
  { path: ':carrera/:plan', component: PlanComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
