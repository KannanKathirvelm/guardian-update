import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationPipesModule } from '@pipes/application-pipes.module';
import { SharedComponentModule } from '@shared/components/shared.component.module';
import { SharedApplicationPipesModule } from '@shared/pipes/shared-application-pipes.module';
import { AvatarModule } from 'ngx-avatar';
import { GuardianHomePageRoutingModule } from './guardian-home-routing.module';
import { GuardianHomePage } from './guardian-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuardianHomePageRoutingModule,
    TranslateModule,
    AvatarModule,
    ComponentsModule,
    SharedComponentModule,
    ApplicationPipesModule,
    SharedApplicationPipesModule
  ],
  declarations: [GuardianHomePage]
})
export class GuardianHomePageModule {}
