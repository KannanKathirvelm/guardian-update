import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpService } from '@providers/apis/http';
import { CustomTranslateLoader } from '@providers/service/custom-translateloader.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { LoadingService } from '@shared/providers/service/loader.service';
import { StorageService } from '@shared/providers/service/store.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MODULES, PROVIDERS } from './app.imports';
import { GlobalErrorHandler } from './global-error';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    MODULES,
    IonicStorageModule.forRoot(),
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpService, LoadingService, StorageService]
      }
    })
  ],
  providers: [
    PROVIDERS,
    {
      provide: APP_INITIALIZER,
      useFactory: (guardianSessionService: GuardianSessionService) => function() {
        return guardianSessionService.initSession();
      },
      deps: [GuardianSessionService],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    StatusBar,
    SplashScreen,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
