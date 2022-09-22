import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { GuardianDescriptionComponent } from '@components/browser/guardian-description/guardian-description.component';
import { LearnerRequestAccessComponent } from '@components/modal/learner-request-access/learner-request-access.component';
import { WardClassroomComponent } from '@components/modal/ward-classroom/ward-classroom.component';
import { NavSideBarComponent } from '@components/nav-side-bar/nav-side-bar.component';
import { SignupAndRequestAccessComponent } from '@components/signup-and-request-access/signup-and-request-access.component';
import { NavInputEmailComponent } from '@components/UI/inputs/nav-input-email/nav-input-email.component';
import { NavInputPasswordComponent } from '@components/UI/inputs/nav-input-password/nav-input-password.component';
import { NavInputTextComponent } from '@components/UI/inputs/nav-input-text/nav-input-text.component';
import { WardCardComponent } from '@components/ward-card/ward-card.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentModule } from '@shared/components/shared.component.module';
import { SharedApplicationPipesModule } from '@shared/pipes/shared-application-pipes.module';
import { AvatarModule } from 'ngx-avatar';

const PAGES_COMPONENTS = [
  NavInputPasswordComponent,
  NavInputTextComponent,
  NavSideBarComponent,
  WardClassroomComponent,
  NavInputEmailComponent,
  WardCardComponent,
  LearnerRequestAccessComponent,
  SignupAndRequestAccessComponent,
  GuardianDescriptionComponent
];

@NgModule({
  declarations: [PAGES_COMPONENTS],
  entryComponents: [
    WardClassroomComponent,
    LearnerRequestAccessComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AvatarModule,
    MatExpansionModule,
    SharedApplicationPipesModule,
    SharedComponentModule
  ],
  exports: [
    PAGES_COMPONENTS
  ]
})

export class ComponentsModule { }
