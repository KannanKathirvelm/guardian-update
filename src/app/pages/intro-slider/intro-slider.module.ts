import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentModule } from '@shared/components/shared.component.module';
import { IntroSliderPageRoutingModule } from './intro-slider-routing.module';
import { IntroSliderPage } from './intro-slider.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroSliderPageRoutingModule,
    SharedComponentModule,
    TranslateModule
  ],
  declarations: [IntroSliderPage]
})
export class IntroSliderPageModule {}
