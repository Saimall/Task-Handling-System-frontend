import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomepageComponentComponent } from './homepage/homepage-component/homepage-component.component';
import { ManagerRegistrationFormComponent } from './manager/manager-registration-form/manager-registration-form.component';
import { ManagerdashboardComponent } from './manager/managerdashboard/managerdashboard.component';
import { ConfigureTasksComponent } from './tasks/configure-tasks/configure-tasks.component';
import { LogincomponentComponent } from './user/logincomponent/logincomponent.component';
import { EmployeedashboardComponent } from './employee/employeedashboard/employeedashboard.component';
const routes: Routes = [
  {path:"",component:HomepageComponentComponent},
  {path:"register",component:ManagerRegistrationFormComponent},
  {path:"login",component:LogincomponentComponent},
  {path:"dashboard/:managerid",component:ManagerdashboardComponent,canActivate:[AuthGuard]},
  { path: 'configure-tasks/:managerId/:projectId', component: ConfigureTasksComponent,canActivate:[AuthGuard] },
  {path:"employeedashboard/:employeeid",component:EmployeedashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
