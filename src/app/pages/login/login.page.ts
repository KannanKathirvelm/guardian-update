import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ERROR_MSG } from '@constants/helper-constants';
import { guardianRouterPathStartWithSlash as guardianRouterPath } from '@constants/router-constants';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@providers/service/auth/auth.service';
import { LoadingService } from '@providers/service/loader.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { ToastService } from '@providers/service/toast.service';
import { UtilsService } from '@shared/providers/service/utils/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // -------------------------------------------------------------------------
  // Properties

  public signInForm: FormGroup;
  public submitted: boolean;
  public usernameVal: string;
  public isIosDevice: boolean;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    public translate: TranslateService,
    protected formBuilder: FormBuilder,
    private loader: LoadingService,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastService: ToastService,
    private utilsService: UtilsService,
    private guardianSessionService: GuardianSessionService,
    private router: Router
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // -------------------------------------------------------------------------
  // Methods

  public ngOnInit() {
    this.isIosDevice = !this.utilsService.isAndroid();
  }

  /**
   * @function login
   * login method used to login by using username and password
   */
  public login() {
    this.submitted = true;
    if (this.signInForm.valid) {
      this.loader.displayLoader();
      const username = this.signInForm.value.email.trim();
      const password = this.signInForm.value.password;
      this.authService.signInWithCredential(username, password).then(() => {
        this.loader.dismissLoader();
        this.guardianSessionService.setGuardianIntroPlayed();
        this.redirectToHomePage();
      }).catch((error) => {
        let errorMsg = error.data.message;
        switch (errorMsg) {
          case ERROR_MSG.EMAIL_NOT_VERIFIED: {
            errorMsg = this.translate.instant('EMAIL_ADDESS_STILL_NOT_VERIFIED');
            this.redirectToEmailVerification();
            break;
          }
          case ERROR_MSG.INVALID_CREDENTIALS: {
            errorMsg = this.translate.instant('SIGN_IN_CREDENTIALS_NOT_VALID');
            break;
          }
          case ERROR_MSG.USER_NOT_FOUND: {
            errorMsg = errorMsg;
            break;
          }
          default: {
            errorMsg = this.translate.instant('SOMETHING_WENT_WRONG');
          }
        }
        this.displayToast(errorMsg);
      }).finally(() => {
        this.loader.dismissLoader();
      });
    }
  }

  /**
   * @function doGoogleLogin
   * This method triggers when user try to do login by using google account
   */
  public doGoogleLogin() {
    this.authService.googleLogin();
  }

  /**
   * @function doAppleLogin
   * This method triggers when user try to do login by using apple account
   */
  public doAppleLogin() {
    this.authService.appleLogin();
  }

  /**
   * @function onClickSignUp
   * This Method is used to navigate to the sign up page
   */
  public onClickSignUp() {
    this.router.navigate([guardianRouterPath('signup')]);
  }

  /**
   * @function displayToast
   * This method is used to display toast
   */
  private displayToast(errorMessage) {
    this.translate
      .get(errorMessage)
      .subscribe(value => {
        this.toastService.presentToast(value);
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
   * @function redirectToEmailVerification
   * Method to redirect to the email verification
   */
  public redirectToEmailVerification() {
    this.navCtrl.navigateForward([guardianRouterPath('emailVerify')], {
      queryParams: { not_verified: true }
    });
  }

  /**
   * @function validateForm
   * validateForm method used to check the basic form validation
   */
  public get validateForm() {
    return this.signInForm.controls;
  }

  /**
   * @function forgotPassword
   * Method to navigate to the forgotPassword page
   */
  public forgotPassword() {
    this.navCtrl.navigateForward(guardianRouterPath('forgotPassword'));
  }
}
