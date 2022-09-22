// Providers
import { HttpService } from '@providers/apis/http';
import { AppService } from '@providers/service/app.service';
import { LoadingService } from '@providers/service/loader.service';
import { ModalService } from '@providers/service/modal.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { ToastService } from '@providers/service/toast.service';
import { TranslationService } from '@providers/service/translation.service';
import { SharedModule } from '@shared/shared.module';
import { AppAuthGuard } from './app.auth.guard';
import { AppLogout } from './app.logout';

// Ionic native providers
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

// Modules
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from '@components/components.module';
import { ApplicationPipesModule } from '@pipes/application-pipes.module';


export const MODULES = [
  ComponentsModule,
  ApplicationPipesModule,
  HttpClientModule,
  BrowserModule,
  BrowserAnimationsModule,
  SharedModule
];

export const PROVIDERS = [
  TranslationService,
  HttpService,
  AppService,
  LoadingService,
  AppAuthGuard,
  GuardianSessionService,
  AppLogout,
  ModalService,
  ToastService,
  SpinnerDialog,
  InAppBrowser
];
