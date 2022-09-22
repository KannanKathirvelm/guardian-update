import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { guardianRouterPath } from '@constants/router-constants';
import { GuardianProfileService } from '@providers/service/guardian-profile/guardian-profile.service';
import { LoadingService } from '@providers/service/loader.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

  // -------------------------------------------------------------------------
  // Properties
  public forgotPasswordForm: FormGroup;
  public submitted: boolean;
  public errorMessage: boolean;
  public tenantImage: string;
  public resetFinished: boolean;
  public googleError: boolean;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private guardianProfileService: GuardianProfileService,
    private loader: LoadingService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.tenantImage = params.tenantImage;
    });
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // -------------------------------------------------------------------------
  // Actions

  /**
   * @function validateForm
   * This method is used to check the basic form validation
   */
  public get validateForm() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * @function onSubmit
   * This method is used to reset the forgot password
   */
  public onSubmit() {
    this.submitted = true;
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.loader.displayLoader();
      this.guardianProfileService.forgotPassword(email).then((response) => {
        this.loader.dismissLoader();
        this.resetFinished = true;
      }).catch((error) => {
        this.errorMessage = true;
        this.loader.dismissLoader();
      });
    }
  }

  /**
   * @function onClose
   * This method is used to close the forgot password page
   */
  public onClose() {
    this.router.navigate([guardianRouterPath('login')]);
  }

  /**
   * @function onEnterEmail
   * This method is triggered when email entered
   */
  public onEnterEmail() {
    this.errorMessage = false;
    this.googleError = false;
  }
}
