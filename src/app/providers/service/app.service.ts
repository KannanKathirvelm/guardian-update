import { Injectable, NgZone } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { deeplinkRoutes, NO_AUTHENTICATION_NEED_ROUTES } from '@constants/deeplink-constants';
import { guardianRouterPathStartWithSlash as routerPath } from '@constants/router-constants';
import { environment } from '@environment/environment';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Market } from '@ionic-native/market/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { LookupService } from '@shared/providers/service/lookup/lookup.service';
import { ProfileService } from '@shared/providers/service/profile/profile.service';
import { UtilsService } from '@shared/providers/service/utils/utils.service';
import { cloneObject, compareVersions, getInBetweenValue } from '@shared/utils/global';
import { BehaviorSubject } from 'rxjs';

export interface DeeplinkModel {
  $link: any;
  $args: any;
  $route: any;
}

@Injectable()
export class AppService {

  // -------------------------------------------------------------------------
  // Properties

  private deeplinkSubject: BehaviorSubject<DeeplinkModel>;

  /**
   * @property deeplink
   * This property is used to get deeplinks
   */
  get deeplink() {
    return this.deeplinkSubject ? cloneObject(this.deeplinkSubject.value) : null;
  }

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private navCtrl: NavController,
    private sessionService: GuardianSessionService,
    private screenOrientation: ScreenOrientation,
    private utilsService: UtilsService,
    private statusBar: StatusBar,
    private market: Market,
    private lookupService: LookupService,
    private translate: TranslateService,
    private alertController: AlertController,
    private deeplinks: Deeplinks,
    private zone: NgZone,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.deeplinkSubject = new BehaviorSubject<DeeplinkModel>(null);
  }

  /**
   * @function lockOrientation
   * This Method is used to lock orientation
   */
  public lockOrientation() {
    if (!this.utilsService.isDesktop()) {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT
      );
    }
  }

  /**
   * @function checkDeeplinkUrl
   * This Method is used to check the deeplink url
   */
  public checkDeeplinkUrl(isDeeplinkUrl) {
    if (isDeeplinkUrl) {
      this.handleDeeplinkUrl();
    } else {
      this.navCtrl.navigateRoot(routerPath('guardianHome'));
    }
  }

  /**
   * @function handleStatusBar
   * This Method is used to handle the status bar
   */
  public handleStatusBar() {
    const isAndroid = this.utilsService.isAndroid();
    if (isAndroid) {
      this.statusBar.styleLightContent();
    } else {
      this.statusBar.styleDefault();
    }
  }

  /**
   * @function initialize
   * This Method is used to initialize update
   */
  public async initialize() {
    const appConfig = await this.lookupService.fetchAppConfig();
    if (appConfig) {
      const isReleaseInfo = appConfig && appConfig.release_info;
      if (isReleaseInfo) {
        const releaseInfo = appConfig.release_info;
        const minVersion = releaseInfo.value.minVersion;
        const appVersion = environment.APP_VERSION;
        const showAlert = compareVersions(minVersion, '>', appVersion);
        if (showAlert) {
          this.displayUpdateAlert();
        }
      }
    }
    return;
  }

  /**
   * @function displayUpdateAlert
   * This Method is used to display the alert update
   */
  public async displayUpdateAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('ALERT'),
      message: this.translate.instant('NAVIGATOR_UPDATE'),
      buttons: [
        {
          text: this.translate.instant('UPDATE'),
          handler: () => {
            this.market.open(environment.PACKAGE_NAME);
            return false;
          },
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  /**
   * @function handleDeeplinkUrl
   * This Method is used to handle deeplink urls
   */
  public handleDeeplinkUrl() {
    const deeplink = this.deeplink;
    const deeplinkId = deeplink.$args.id;
    const deeplinkPath = deeplink.$link.path;
    this.navigateDeeplinkUrl(deeplinkId, deeplinkPath);
  }

  /**
   * @function fetchRoleList
   * This Method is used to fetch role list
   */
  public fetchRoleList() {
    this.profileService.fetchRoleRelationshipList();
  }

  /**
   * @function navigateDeeplinkUrl
   * This Method is used to navigate to deeplink url
   */
  public navigateDeeplinkUrl(id, path) {
    const params = {
      id
    };
    this.router.navigate([path], {
      queryParams: params
    });
  }

  /**
   * @function registerDeeplinks
   * This Method is used to register deeplinks
   */
  public async registerDeeplinks() {
    this.deeplinks.route(deeplinkRoutes()).subscribe(match => {
      this.zone.run(() => {
        this.sessionService.currentGuardianSession.subscribe((session) => {
          const isAuthenticated = this.sessionService.isLoggedInUser(session);
          if (isAuthenticated || NO_AUTHENTICATION_NEED_ROUTES.includes(match.$link.path)) {
            // these steps used to avoid decode in URL
            const queryString = match.$link.queryString;
            const splitBy = queryString.includes('&') ? '&' : '';
            const parseToken = getInBetweenValue(queryString, 'token=', splitBy);
            match.$args.token = parseToken;
            this.navCtrl.navigateRoot([match.$link.path], { queryParams: match.$args });
          } else {
            this.deeplinkSubject.next(match);
            const navigationExtras: NavigationExtras = {
              queryParams: { isDeeplinkUrl: true }
            };
            this.navCtrl.navigateRoot(routerPath('login'), navigationExtras);
          }
        });
      });
    }, nomatch => {
      const error = `Got a deeplink that didn\'t match ${nomatch}`;
      // tslint:disable-next-line
      console.error(error);
    });
  }

}
