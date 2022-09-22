import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentModule } from '@shared/components/shared.component.module';
import { EmailApprovalPageRoutingModule } from './email-approval-routing.module';
import { EmailApprovalPage } from './email-approval.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    TranslateModule,
    EmailApprovalPageRoutingModule,
    SharedComponentModule
  ],
  declarations: [EmailApprovalPage]
})
export class EmailApprovalPageModule {}
