import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponentComponent } from './homepage/homepage-component/homepage-component.component';
import { ManagerRegistrationFormComponent } from './manager/manager-registration-form/manager-registration-form.component';
import { ManagerdashboardComponent } from './manager/managerdashboard/managerdashboard.component';
import { LogincomponentComponent } from './user/logincomponent/logincomponent.component';

const routes: Routes = [
  {path:"",component:HomepageComponentComponent},
  {path:"register",component:ManagerRegistrationFormComponent},
  {path:"login",component:LogincomponentComponent},
  {path:"dashboard/:managerid",component:ManagerdashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
