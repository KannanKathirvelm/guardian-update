import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMAIL_STATUS } from '@constants/helper-constants';
import { guardianRouterPath } from '@constants/router-constants';
import { TranslateService } from '@ngx-translate/core';
import { GuardianProfileService } from '@providers/service/guardian-profile/guardian-profile.service';
import { LoadingService } from '@providers/service/loader.service';
import { ModalService } from '@providers/service/modal.service';
import { ToastService } from '@providers/service/toast.service';
import { GuardianUtilsService } from '@providers/service/utils/utils.service';

@Component({
  selector: 'app-email-approval',
  templateUrl: './email-approval.page.html',
  styleUrls: ['./email-approval.page.scss'],
})
export class EmailApprovalPage implements OnInit {

  // -------------------------------------------------------------------------
  // Properties

  public token: string;
  public showSuccessAlert: boolean;
  public successMessage: string;
  public status: string;
  public isDesktopView: boolean;
  public inviteId: string;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private router: Router,
    private loader: LoadingService,
    private activatedRoute: ActivatedRoute,
    private guardianProfileService: GuardianProfileService,
    private toastService: ToastService,
    private translate: TranslateService,
    private modalService: ModalService,
    public guardianUtilsService: GuardianUtilsService
  ) {
    this.initialize();
  }

  /**
   * @function initialize
   * This method is used to initialize
   */
  public initialize() {
    this.isDesktopView = this.guardianUtilsService.isBrowser();
    this.token = this.activatedRoute.snapshot.queryParams.token;
    this.status = this.activatedRoute.snapshot.queryParams.status
      ? atob(this.activatedRoute.snapshot.queryParams.status)
      : null;
    if (this.token) {
      const decodedToken = atob(this.token).split(':');
      this.inviteId = decodedToken[2];
    }
  }

  public ngOnInit() {
    if (this.status === EMAIL_STATUS.NEW) {
      this.redirectToSignup();
    } else {
      this.approveAccount({ token: this.token });
    }
  }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function redirectToLoginPage
   * This method is used to redirect to login page
   */
  public redirectToLoginPage() {
    this.router.navigate([guardianRouterPath('login')]);
  }

  /**
   * @function redirectToSignup
   * This method is used to redirect to signup page
   */
  public redirectToSignup() {
    this.router.navigate([guardianRouterPath('signup')], { queryParams: { isNewUser: true, inviteId: this.inviteId } });
  }

  /**
   * @function redirectToDownloadApp
   * This method is used to redirect to download app page
   */
  public redirectToDownloadApp() {
    this.router.navigate([guardianRouterPath('appDownload')], { queryParams: { msgType: btoa('STUDENT_APPROVE_SUCCESS') } });
  }

  /**
   * @function approveAccount
   * Method to approve account
   */
  public approveAccount(params) {
    this.loader.displayLoader();
    this.guardianProfileService.approveAccount(params).then(() => {
      this.successMessage = this.translate.instant('ACCOUNT_VERIFIED_MSG');
      this.showSuccessAlert = true;
    }).catch((error) => {
      if (error && !this.isDesktopView) {
        const errorMsg = error.status === 401
          ? this.translate.instant('GUARDIAN_EMAIL_VERIFY_EXPIRED')
          : this.translate.instant('SOMETHING_WENT_WRONG');
        this.toastService.presentToast(errorMsg);
        this.redirectToLoginPage();
      }
    }).finally(() => {
      this.loader.dismissLoader();
      if (this.isDesktopView) {
        this.redirectToDownloadApp();
      }
    });
  }

  /**
   * @function dismissAlert
   * Method to close alert
   */
  public dismissAlert(value) {
    if (value) {
      this.redirectToLoginPage();
      this.modalService.dismiss();
      this.showSuccessAlert = false;
    }
  }
}
