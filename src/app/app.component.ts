import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AppLogout } from '@app/app.logout';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { AppService } from '@providers/service/app.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { TranslationService } from '@providers/service/translation.service';
import { GuardianUtilsService } from '@providers/service/utils/utils.service';
declare var cordova: any;
import { HttpService } from '@providers/apis/http';
import { GuardianParseService } from '@providers/service/parse/parse.service';
import { AnonymousSubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  // -------------------------------------------------------------------------
  // Properties

  public isAuthenticated: boolean;
  public userSession: any;
  public isDesktopView: boolean;
  private isSessionInvalidateCalled: boolean;
  private sessionInvalidateSubscription: AnonymousSubscription;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private appLogoutService: AppLogout,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private guardianSessionService: GuardianSessionService,
    private keyboard: Keyboard,
    private translationService: TranslationService,
    private appService: AppService,
    private guardianUtilsService: GuardianUtilsService,
    private guardianParseService: GuardianParseService,
    private httpService: HttpService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initializeApp();
  }

  // -------------------------------------------------------------------------
  // lifecycle events

  public ngOnInit() {
    this.guardianSessionService.currentGuardianSession.subscribe((session) => {
      this.isAuthenticated = this.guardianSessionService.isLoggedInUser(session);
      this.userSession = session;
    });
    if (!this.guardianUtilsService.isBrowser()) {
      this.guardianParseService.fetchLocationInfo();
    }
    this.subscribeToSessionInvalidate();
  }

  public ngAfterViewInit() {
    // We loading the mathjax script on after view is loaded
    import('assets/js/mathjax-loader.js');
  }

  public ngOnDestroy() {
    this.sessionInvalidateSubscription.unsubscribe();
  }

  // -------------------------------------------------------------------------
  // methods

  public initializeApp() {
    this.platform.ready().then(() => {
      this.isDesktopView = this.guardianUtilsService.isBrowser();
      this.initTranslate();
      this.hideSplashScreen();
      this.appService.fetchRoleList();
      if (this.platform.is('cordova')) {
        this.appService.handleStatusBar();
        this.appService.lockOrientation();
        this.appService.registerDeeplinks();
        this.keyboard.disableScroll(true);
        this.requestAppTrackingTransparency();
      }
      if (this.isDesktopView) {
        this.document.body.classList.add('browser-body');
      }
    });
  }

  /**
   * @function initTranslate
   * This Method is used to init translation
   */
  private initTranslate() {
    this.translationService.initTranslate();
  }

  /**
   * @function onLogout
   * This Method is used to logout from the app
   */
  public onLogout() {
    this.isAuthenticated = false;
    this.appLogoutService.execute();
  }

  /**
   * @function hideSplashScreen
   * This Method is used to hide splash screen
   */
  private hideSplashScreen() {
    this.splashScreen.hide();
  }

  /**
   * @function requestAppTrackingTransparency
   * This Method is used to request the app tracking transparency
   */
  private requestAppTrackingTransparency() {
    if (this.platform.is('ios')) {
      const idfaPlugin = cordova.plugins.idfa;
      idfaPlugin.getInfo().then((info) => {
        if (info.trackingPermission !== idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
          idfaPlugin.requestPermission();
        }
      });
    }
  }

  /**
   * @function subscribeToSessionInvalidate
   * This Method is used to subscribe to refresh token
   */
  public subscribeToSessionInvalidate() {
    this.sessionInvalidateSubscription = this.httpService.sessionInvalidate.subscribe((tokenTime) => {
      if (!this.isSessionInvalidateCalled && tokenTime) {
        this.guardianSessionService.sessionInValidate();
        this.isSessionInvalidateCalled = true;
      }
    });
  }
}
