import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DownloadAppPageRoutingModule } from './download-app-routing.module';
import { DownloadAppPage } from './download-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadAppPageRoutingModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [DownloadAppPage]
})
export class DownloadAppPageModule {}
