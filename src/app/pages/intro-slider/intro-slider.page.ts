import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { guardianRouterPath } from '@constants/router-constants';
import { TranslateService } from '@ngx-translate/core';
import { GuardianUtilsService } from '@providers/service/guardian-utils.service';
import { ModalService } from '@providers/service/modal.service';
import { GuardianSessionService } from '@providers/service/session/session.service';

@Component({
  selector: 'app-intro-slider',
  templateUrl: './intro-slider.page.html',
  styleUrls: ['./intro-slider.page.scss'],
})
export class IntroSliderPage {

  // -------------------------------------------------------------------------
  // Methods

  public currentIndex: number;
  public totalSlide: number;
  public slideOpts: {
    initialSlide: number,
    speed: number,
    effect: string,
  };
  public showSuccessAlert: boolean;
  public successMessage: string;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private router: Router,
    private guardianSessionService: GuardianSessionService,
    private guardianUtilsService: GuardianUtilsService,
    private modalService: ModalService,
    private translate: TranslateService
  ) {
    this.initialize();
  }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function initialize
   * this Method is used to initialize
   */
  public initialize() {
    this.currentIndex = 0;
    this.totalSlide = 3;
    this.slideOpts = {
      initialSlide: 0,
      speed: 500,
      effect: 'flip',
    };
    this.successMessage = this.translate.instant('REQUEST_ACCESS_MSG');
    this.guardianSessionService.isGuardianIntroPlayed().then((isIntroPlayed) => {
      if (isIntroPlayed) {
        this.redirectToLogin();
        return;
      }
    });
  }

  /**
   * @function redirectToLogin
   * this Method is used to redirect to login page
   */
  public redirectToLogin() {
    this.router.navigate([guardianRouterPath('login')]);
  }

  /**
   * @function redirectToSignup
   * this Method is used to redirect to sign up page
   */
  public redirectToSignup() {
    this.router.navigate([guardianRouterPath('signup')], { queryParams: { introSlider: true } });
  }

  /**
   * @function finish
   * this Method is used to set intro played true
   */
  public finish() {
    this.redirectToLogin();
  }

  /**
   * @function redirectToNavigatorApp
   * this Method is used to redirect to navigator app
   */
  public redirectToNavigatorApp() {
    this.guardianUtilsService.openNavigatorApp();
  }

  /**
   * @function dismissAlert
   * Method to close alert
   */
  public dismissAlert(value) {
    if (value) {
      this.modalService.dismiss();
      this.showSuccessAlert = false;
    }
  }
}
