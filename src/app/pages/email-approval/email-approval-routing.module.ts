import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailApprovalPage } from './email-approval.page';

const routes: Routes = [
  {
    path: '',
    component: EmailApprovalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailApprovalPageRoutingModule {}
