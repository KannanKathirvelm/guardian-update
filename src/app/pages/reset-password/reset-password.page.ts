import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { guardianRouterPath } from '@constants/router-constants';
import { TranslateService } from '@ngx-translate/core';
import { GuardianProfileService } from '@providers/service/guardian-profile/guardian-profile.service';
import { LoadingService } from '@providers/service/loader.service';
import { ModalService } from '@providers/service/modal.service';
import { ToastService } from '@providers/service/toast.service';

@Component({
  selector: 'nav-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {

  // -------------------------------------------------------------------------
  // Properties
  public resetPasswordForm: FormGroup;
  public submitted: boolean;
  public token: string;
  public showSuccessAlert: boolean;
  public successMessage: string;

  // -------------------------------------------------------------------------
  // Dependency Injection
  constructor(
    private formBuilder: FormBuilder,
    private loader: LoadingService,
    private activatedRoute: ActivatedRoute,
    private guardianProfileService: GuardianProfileService,
    private toastService: ToastService,
    private translate: TranslateService,
    private router: Router,
    private modalService: ModalService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params.token;
    });
  }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function validateForm
   * @return {boolean}
   * Method to check the basic form validation
   */
  get validateForm() {
    return this.resetPasswordForm.controls;
  }

  /**
   * @function checkPassword
   * @return {boolean}
   * this Method is used to check the password with confirm password as same
   */
  get checkPassword() {
    return this.resetPasswordForm.get('password').value === this.resetPasswordForm.get('confirmPassword').value ? null : { notSame: true };
  }

  /**
   * @function resetPassword
   * this Method is used to reset password
   */
  public resetPassword() {
    this.submitted = true;
    if (this.resetPasswordForm.valid && !this.checkPassword) {
      this.loader.displayLoader();
      const resetPasswordForm = this.resetPasswordForm.value;
      this.guardianProfileService.resetPassword(btoa(resetPasswordForm.password), this.token).then(() => {
        this.successMessage = this.translate.instant('PASSWORD_RESET_SUCCESS_MSG');
        this.showSuccessAlert = true;
      }).catch((error) => {
        if (error) {
          const wentWrongMsg = this.translate.instant('SOMETHING_WENT_WRONG');
          this.toastService.presentToast(wentWrongMsg);
          this.loader.dismissLoader();
        }
      }).finally(() => {
        this.loader.dismissLoader();
      });
    }
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

  /**
   * @function redirectToLoginPage
   * This method is used to redirect to login page
   */
  public redirectToLoginPage() {
    this.router.navigate([guardianRouterPath('login')]);
  }
}
