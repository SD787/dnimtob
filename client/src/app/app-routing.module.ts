import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { MainStreamComponent } from './component/main-stream/main-stream.component';
import { AuthGuardService } from './service/auth-guard.service';

export const ROUTES: Routes = [
  { 
    path: '',
    component: MainStreamComponent,
    canActivate: [AuthGuardService]
  },
  { 
    path: 'login', 
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
