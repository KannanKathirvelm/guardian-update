import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardianHomePage } from './guardian-home.page';

const routes: Routes = [
  {
    path: '',
    component: GuardianHomePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuardianHomePageRoutingModule {}
