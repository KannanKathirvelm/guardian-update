import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ERROR_MSG } from '@constants/helper-constants';
import { guardianRouterPathStartWithSlash as routerPath } from '@constants/router-constants';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GuardianProfileService } from '@providers/service/guardian-profile/guardian-profile.service';
import { LoadingService } from '@providers/service/loader.service';
import { ModalService } from '@providers/service/modal.service';
import { ToastService } from '@providers/service/toast.service';
import { GuardianUtilsService } from '@providers/service/utils/utils.service';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.page.html',
  styleUrls: ['./email-verify.page.scss'],
})

export class EmailVerifyPage implements OnInit, AfterViewInit {

  // -------------------------------------------------------------------------
  // Properties

  public showSuccessAlert: boolean;
  public token: string;
  public resendEmailForm: FormGroup;
  public submitted: boolean;
  public showResendEmailForm: boolean;
  public successMessage: string;
  public isEmailverified: boolean;
  public isLoaded: boolean;
  public isEmailNotVerified: boolean;
  public message: string;
  public isDesktopView: boolean;
  public desktopMessage: string;
  public isEmailNotFound: boolean;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private navCtrl: NavController,
    protected formBuilder: FormBuilder,
    private translate: TranslateService,
    private toastService: ToastService,
    private guardianProfileService: GuardianProfileService,
    private loader: LoadingService,
    private guardianUtilsService: GuardianUtilsService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.token = this.activatedRoute.snapshot.queryParams.token;
    this.isEmailNotVerified = this.activatedRoute.snapshot.queryParams.not_verified;
    this.resendEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.isDesktopView = this.guardianUtilsService.isBrowser();
  }

  // -------------------------------------------------------------------------
  // life cycle methods

  public ngOnInit() {
    if (this.isEmailNotVerified) {
      this.isLoaded = true;
      this.message = this.translate.instant('ACCOUNT_NOT_VERIFIED_MSG');
      this.showResendEmailForm = true;
    } else {
      this.emailVerification();
    }
  }

  public ngAfterViewInit() {
    if (this.isDesktopView) {
      const elementNativeElement = this.elementRef.nativeElement;
      this.guardianUtilsService.customFadeInAnimation(elementNativeElement);
    }
  }

  // -------------------------------------------------------------------------
  // methods

  /**
   * @function emailVerification
   * method is used tp verify email id
   */
  public emailVerification() {
    this.loader.displayLoader();
    this.guardianProfileService.updateEmailVerification(this.token).then((response) => {
      this.isEmailverified = true;
      if (this.isDesktopView) {
        this.redirectToDownloadApp('EMAIL_VERIFY_SUCCESS');
      }
    }).catch((error) => {
      if (error) {
        let errorMessage = error.data.message || 'SOMETHING_WENT_WRONG';
        if (errorMessage !== ERROR_MSG.ALREADY_VERIFIED) {
          errorMessage = 'EMAIL_VERIFY_TOKEN_EXPIRED_TOAST_MSG';
          this.message = this.translate.instant('EMAIL_VERIFY_TOKEN_EXPIRED_MSG');
          this.showResendEmailForm = true;
          this.displayToast(errorMessage);
        } else {
          if (this.isDesktopView) {
            this.redirectToDownloadApp('ALREADY_VERIFIED');
          } else {
            this.displayToast('ALREADY_VERIFIED');
            this.redirectToLogin();
          }
        }
      }
    }).finally(() => {
      this.isLoaded = true;
      this.loader.dismissLoader();
    });
  }

  /**
   * @function resendEmail
   * method is run after submit resend form
   */
  public resendEmail() {
    this.submitted = true;
    if (this.resendEmailForm.valid) {
      const emailId = this.resendEmailForm.value.email;
      this.guardianProfileService.resendVerificationEmail(emailId).then((response) => {
        this.successMessage = this.translate.instant('RESEND_EMAIL_MSG');
        this.showSuccessAlert = true;
        this.redirectToDownloadApp('SIGNUP_SUCCESS');
      }).catch((error) => {
        if (error) {
          if (error.data.message === ERROR_MSG.INVALID_EMAIL) {
            this.isEmailNotFound = true;
            setTimeout(() => {
              this.isEmailNotFound = false;
            }, 4000);
          } else if (error.status === 400) {
            this.displayToast(error.data.message);
          }
        }
      });
    }
  }

  /**
   * @function validateForm
   * validateForm method used to check the basic form validation
   */
  public get validateForm() {
    return this.resendEmailForm.controls;
  }

  /**
   * @function dismissAlert
   * Method to close alert
   */
  public dismissAlert(value) {
    if (value) {
      this.redirectToLogin();
      this.modalService.dismiss();
      this.showSuccessAlert = false;
    }
  }

  /**
   * @function redirectToLogin
   * this Method is used to navigate to the username login page
   */
  public redirectToLogin() {
    this.navCtrl.navigateForward([routerPath('login')]);
  }

  /**
   * @function redirectToDownloadApp
   * This method is used to redirect to download app page
   */
  public redirectToDownloadApp(msgType) {
    if (this.isDesktopView) {
      this.router.navigate([routerPath('appDownload')], {
        queryParams: {
          msgType: btoa(msgType)
        }
      });
    }
  }

  /**
   * @function displayToast
   * This method is used to display toast
   */
  private displayToast(errorMessage) {
    if (!this.isDesktopView) {
      this.translate
        .get(errorMessage)
        .subscribe(value => {
          this.toastService.presentToast(value);
        });
    }
  }
}
