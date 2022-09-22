import { Injectable } from '@angular/core';
import { LOGIN_TYPE, PLAYER_TOOLBAR_OPTIONS } from '@constants/helper-constants';
import { guardianRouterPathStartWithSlash as guardianRouterPath } from '@constants/router-constants';
import { environment } from '@environment/environment';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { NavController } from '@ionic/angular';
import { AuthProvider } from '@providers/apis/auth/auth';
import { WardProvider } from '@providers/apis/ward/ward';
import { LoadingService } from '@providers/service/loader.service';
import { GuardianSessionService } from '@providers/service/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // -------------------------------------------------------------------------
  // Dependency injection

  constructor(
    private authProvider: AuthProvider,
    private wardProvider: WardProvider,
    private spinnerDialog: SpinnerDialog,
    private navCtrl: NavController,
    private inAppBrowser: InAppBrowser,
    private guardianSessionService: GuardianSessionService,
    private loadingService: LoadingService
  ) { }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function signInWithCredential
   * This method is used to sign in with credential
   */
  public signInWithCredential(username, password) {
    return this.signinGuardian(username, password).then((sessionData) => {
      this.guardianSessionService.setGuardianDetailsInStorage(LOGIN_TYPE.CREDENTIALS, {
        username,
        password: btoa(password)
      });
      return this.guardianSessionService.setSession(sessionData);
    });
  }

  /**
   * @function studentLogin
   * This method is used to student login
   */
  public studentLogin(token) {
    return this.authProvider.signInWithToken(token);
  }

  /**
   * @function signupGuardian
   * This method is used to signup guardian
   */
  public signupGuardian(requestParams) {
    return this.authProvider.signupGuardian(requestParams);
  }

  /**
   * @function signinGuardian
   * This method is used to signin guardian
   */
  public signinGuardian(username, password) {
    return this.authProvider.signInWithCredential(username, password);
  }

  /**
   * @function inviteStudent
   * This method is used to invite student
   */
  public inviteStudent(requestParams) {
    return this.wardProvider.inviteToStudent(requestParams.sEmail, requestParams.relationshipId, requestParams.token);
  }

  /**
   * @function googleLogin
   * This method used to do google login
   */
  public googleLogin() {
    const options = this.getInAppBrowserOptions();
    const googleAPI = `${environment.API_END_POINT}/api/guardian-sso/v1/google/launch`;
    const browser = this.inAppBrowser.create(googleAPI, '_blank', options);
    browser.on('loadstart').subscribe(() => {
      this.spinnerDialog.show();
    });
    browser.on('loadstop').subscribe(event => {
      this.spinnerDialog.hide();
      if (event.url != null && event.url.indexOf('access_token') > -1) {
        browser.close();
        let accessToken =  event.url.split('access_token=')[1];
        this.loadingService.displayLoader();
        // adding # for first time login in access token, to remove that
        accessToken = accessToken.replace('#', '');
        this.accessTokenAuthentication(accessToken);
      }
    });
    browser.on('loaderror').subscribe(() => {
      this.spinnerDialog.hide();
    });
    browser.on('exit').subscribe(() => {
      this.spinnerDialog.hide();
    });
  }


  /**
   * @function appleLogin
   * This method used to do apple login
   */
  public appleLogin() {
    const options = this.getInAppBrowserOptions();
    const appleAPI = `${environment.API_END_POINT}/api/guardian-sso/v1/apple/launch`;
    const browser = this.inAppBrowser.create(appleAPI, '_blank', options);
    browser.on('loadstart').subscribe(() => {
      this.spinnerDialog.show();
    });
    browser.on('loadstop').subscribe(event => {
      this.spinnerDialog.hide();
      if (event.url != null && event.url.indexOf('access_token') > -1) {
        browser.close();
        let accessToken = event.url.split('access_token=')[1];
        this.loadingService.displayLoader();
        // adding # for first time login in access token, to remove that
        accessToken = accessToken.replace('#', '');
        this.accessTokenAuthentication(accessToken);
      }
    });
    browser.on('loaderror').subscribe(() => {
      this.spinnerDialog.hide();
    });
    browser.on('exit').subscribe(() => {
      this.spinnerDialog.hide();
    });
  }

  /**
   * @function getInAppBrowserOptions
   * This method is used to get the in app browser options
   */
  public getInAppBrowserOptions() {
    const options: InAppBrowserOptions = {
      location: 'yes',
      hidden: 'no',
      zoom: 'yes',
      hideurlbar: 'yes',
      toolbarcolor: PLAYER_TOOLBAR_OPTIONS.BACKGROUND_COLOR,
      navigationbuttoncolor: PLAYER_TOOLBAR_OPTIONS.FONT_COLOR,
      closebuttoncolor: PLAYER_TOOLBAR_OPTIONS.FONT_COLOR,
    };
    return options;
  }


  /**
   * @function accessTokenAuthentication
   * this method used to authenticate signInWithSSOToken login
   */
  public accessTokenAuthentication(accessToken: string) {
    this.authProvider.signInWithSSOToken(accessToken).then((sessionData) => {
      this.loadingService.dismissLoader();
      sessionData.accessToken = accessToken;
      this.guardianSessionService.setSession(sessionData);
      this.guardianSessionService.setGuardianIntroPlayed();
      this.guardianSessionService.setGuardianDetailsInStorage(LOGIN_TYPE.SSO);
      this.redirectToHomePage();
    });
  }

  /**
   * @function redirectToHomePage
   * method to redirect to guardian home page
   */
  public redirectToHomePage() {
    this.navCtrl.navigateRoot(guardianRouterPath('guardianHome'));
  }

  /**
   * @function fetchTenantList
   * method used to fetch account list
   */
  public fetchTenantList(emailId) {
    return this.guardianSessionService.getAccessToken().then((token) => {
      return this.authProvider.fetchTenantList(emailId, token);
    });
  }
}
