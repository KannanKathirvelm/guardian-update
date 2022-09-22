import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ERROR_MSG, LOGIN_TYPE, REQUEST_ACCESS_PAGE_TYPE } from '@constants/helper-constants';
import { guardianRouterPath } from '@constants/router-constants';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@providers/service/auth/auth.service';
import { LoadingService } from '@providers/service/loader.service';
import { ModalService } from '@providers/service/modal.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { GuardianUtilsService } from '@providers/service/utils/utils.service';
import { RoleModel } from '@shared/models/profile-portfolio/profile-portfolio';
import { ProfileService } from '@shared/providers/service/profile/profile.service';
import { ToastService } from '@shared/providers/service/toast.service';

@Component({
  selector: 'nav-signup-and-request-access',
  templateUrl: './signup-and-request-access.component.html',
  styleUrls: ['./signup-and-request-access.component.scss'],
})
export class SignupAndRequestAccessComponent implements OnInit {

  // -------------------------------------------------------------------------
  // Properties

  public pageForm: FormGroup;
  public submitted: boolean;
  public successMessage: string;
  public roleList: Array<RoleModel>;
  public customSelectOptions: { header: string };
  public showSuccessAlert: boolean;
  public isAuthenticated: boolean;
  public savedGuardianDetails: {
    type: string;
    credentials: {
      username: string;
      password: string;
    }
  };
  public pageType: string;
  public isNewUser: boolean;
  public inviteId: string;
  public isRedirectToIntroSlider: boolean;
  public isLoaded: boolean;
  public isDesktopView: boolean;
  public desktopMessage: string;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    protected formBuilder: FormBuilder,
    private modalService: ModalService,
    private profileService: ProfileService,
    private toastService: ToastService,
    private translate: TranslateService,
    private guardianSessionService: GuardianSessionService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public loader: LoadingService,
    private guardianUtilsService: GuardianUtilsService
  ) {
    this.pageForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      wardFirstname: ['', Validators.required],
      wardLastname: ['', Validators.required],
      wardEmail: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required]
    });
    this.isNewUser = this.activatedRoute.snapshot.queryParams.isNewUser === 'true';
    this.inviteId = this.activatedRoute.snapshot.queryParams.inviteId;
    this.isDesktopView = this.guardianUtilsService.isBrowser();
  }

  // -------------------------------------------------------------------------
  // life cycle methods

  public ngOnInit() {
    this.initialize();
    this.profileService.fetchRoleRelationshipList().then((roleListResponse) => {
      this.roleList = roleListResponse;
      this.customSelectOptions = { header: 'Role' };
    });
  }

  // -------------------------------------------------------------------------
  // methods

  /**
   * @function initialize
   * This method is used to initialize values and forms
   */
  public initialize() {
    this.guardianSessionService.getSavedGuardianDetails().then((guardianDetails) => {
      this.guardianSessionService.isAuthenticated().then((authenticated) => {
        this.savedGuardianDetails = guardianDetails;
        this.isAuthenticated = authenticated;
        this.pageType = this.isNewUser || this.isDesktopView
          ? REQUEST_ACCESS_PAGE_TYPE.SIGNUP
          : (guardianDetails && guardianDetails.type === LOGIN_TYPE.CREDENTIALS || authenticated)
            ? REQUEST_ACCESS_PAGE_TYPE.REQUEST_ACCESS
            : REQUEST_ACCESS_PAGE_TYPE.REQUEST_ACCESS_SIGNUP;
        this.setFormValidation();
        this.isLoaded = true;
      });
    });
  }

  /**
   * @function setFormValidation
   * This method is used to set form validation
   */
  public setFormValidation() {
    const signupValidators = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    const requestAccessValidators = ['wardFirstname', 'wardLastname', 'wardEmail', 'roles'];
    const signupRequestAccessValidators = signupValidators.concat(requestAccessValidators);
    const selectValidatorArray = this.pageType === REQUEST_ACCESS_PAGE_TYPE.SIGNUP
      ? signupValidators
      : this.pageType === REQUEST_ACCESS_PAGE_TYPE.REQUEST_ACCESS
        ? requestAccessValidators
        : signupRequestAccessValidators;
    const formControls = this.pageForm.controls;
    for (const key of Object.keys(formControls)) {
      const ignoreFormValid = selectValidatorArray.includes(key);
      if (!ignoreFormValid) {
        formControls[key].setValidators(null);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function validateForm
   * This method is used to check the basic form validation
   */
  public get validateForm() {
    return this.pageForm.controls;
  }

  /**
   * @function checkPassword
   * @return {boolean}
   * this Method is used to check the password with confirm password as same
   */
  get checkPassword() {
    return this.pageForm.get('password').value === this.pageForm.get('confirmPassword').value
      ? null
      : { notSame: true };
  }

  /**
   * @function formSubmit
   * This method is used to set form
   */
  public formSubmit() {
    this.submitted = true;
    if (this.pageForm.valid) {
      const pageFormValue = this.pageForm.value;
      const email = pageFormValue.email.trim();
      const pageFormEntries = {
        gFirstname: pageFormValue.firstName,
        gLastname: pageFormValue.lastName,
        gEmail: email,
        gPassword: pageFormValue.password,
        sFirstname: pageFormValue.wardFirstname,
        sLastname: pageFormValue.wardLastname,
        sEmail: pageFormValue.wardEmail,
        relationshipId: pageFormValue.roles,
        token: null
      };
      switch (this.pageType) {
        case REQUEST_ACCESS_PAGE_TYPE.SIGNUP: {
          this.successMessage = this.translate.instant('SIGN_UP_VERIFICATION_EMAIL_MSG');
          this.signup(pageFormEntries);
          break;
        }
        case REQUEST_ACCESS_PAGE_TYPE.REQUEST_ACCESS: {
          this.successMessage = this.translate.instant('SIGN_UP_AND_REQUEST_SUCCESS', {
            nameOfWard: `${pageFormEntries.sFirstname} ${pageFormEntries.sLastname}`
          });
          this.requestAccess(pageFormEntries);
          break;
        }
        case REQUEST_ACCESS_PAGE_TYPE.REQUEST_ACCESS_SIGNUP: {
          const signupSuccessMsg = this.translate.instant('SIGN_UP_VERIFICATION_EMAIL_MSG');
          const requestAccessMsg = this.translate.instant('SIGN_UP_AND_REQUEST_SUCCESS', {
            nameOfWard: `${pageFormEntries.sFirstname} ${pageFormEntries.sLastname}`
          });
          this.successMessage = `${signupSuccessMsg} ${requestAccessMsg}`;
          this.signupRequestAccess(pageFormEntries);
          break;
        }
      }
    }
  }

  /**
   * @function signup
   * This method is used to signup functionality
   */
  public signup(requestParams) {
    if (!this.checkPassword) {
      this.loader.displayLoader();
      this.signupGuardianUsingAuth(requestParams);
    }
  }

  /**
   * @function requestAccess
   * This method is used to request access
   */
  public requestAccess(requestParams) {
    this.loader.displayLoader();
    if (this.savedGuardianDetails && this.isAuthenticated) {
      this.requestAccessUsingAuth(requestParams);
    } else {
      this.loginUsingAuth(requestParams);
    }
  }

  /**
   * @function signupRequestAccess
   * This method is used to signup and request access
   */
  public signupRequestAccess(requestParams) {
    if (!this.checkPassword) {
      this.loader.displayLoader();
      this.authService.fetchTenantList(requestParams.sEmail).then((profileUser) => {
        const profileUserDetails = profileUser;
        if ( profileUserDetails && profileUserDetails.length ) {
          this.signupGuardianUsingAuth(requestParams).then((guardianDetails) => {
            requestParams.token = guardianDetails['accessToken'];
            this.requestAccessUsingAuth(requestParams);
          });
        }
      }).catch((error) => {
        const wardUserNotFound = this.translate.instant('EMAIL_NOT_FOUND_MSG');
        this.displayToast(wardUserNotFound);
      }).finally(() => {
        this.loader.dismissLoader();
      });
    }
  }

  /**
   * @function signupGuardianUsingAuth
   * This method is used to signup guardian using auth service - common method
   */
  public signupGuardianUsingAuth(requestParams) {
    const email = requestParams.gEmail.trim();
    return this.authService.signupGuardian({
      email,
      first_name: requestParams.gFirstname,
      last_name: requestParams.gLastname,
      password: btoa(requestParams.gPassword),
      invite_id: this.inviteId ? Number(this.inviteId) : undefined
    }).then((guardianDetails) => {
      this.showSuccessAlert = true;
      this.redirectToDownloadApp();
      return guardianDetails;
    }).catch((error) => {
      if (error) {
        if (error.status === 400) {
          const errorMessage = error.data.message;
          this.desktopMessage = errorMessage;
          setTimeout(() => {
            this.desktopMessage = '';
          }, 4000);
          if (!this.isDesktopView) {
            this.displayToast(errorMessage);
          }
        }
      }
    }).finally(() => {
      this.loader.dismissLoader();
    });
  }

  /**
   * @function loginUsingAuth
   * This method is used to login
   */
  public loginUsingAuth(requestParams) {
    const isGuardianAuthenticated = !this.isAuthenticated && this.savedGuardianDetails;
    const username = isGuardianAuthenticated ? this.savedGuardianDetails.credentials.username.trim() : requestParams.gEmail.trim();
    const password = isGuardianAuthenticated ? atob(this.savedGuardianDetails.credentials.password) : requestParams.password;
    this.authService.signinGuardian(username, password).then((guardianDetails) => {
      requestParams.token = guardianDetails.accessToken;
      this.requestAccessUsingAuth(requestParams);
    }).catch((error) => {
      if (error) {
        const errorMessage = error.data.message || 'SOMETHING_WENT_WRONG';
        this.toastService.presentToast(errorMessage);
      }
    }).finally(() => {
      this.loader.dismissLoader();
    });
  }

  /**
   * @function requestAccessUsingAuth
   * This method is used to request access using auth service- common method
   */
  public requestAccessUsingAuth(requestParams) {
    return this.authService.inviteStudent(requestParams).then(() => {
      this.showSuccessAlert = true;
    }).catch((error) => {
      if (error.status === 400) {
        let errorMsg = error.data.message;
        switch (errorMsg) {
          case ERROR_MSG.GUARDIAN_ALREADY_EXIST: {
            errorMsg = this.translate.instant('GUARDIAN_ALREADY_EXIST_MSG');
            break;
          }
          case ERROR_MSG.EMAIL_NOT_FOUND: {
            errorMsg = this.translate.instant('EMAIL_NOT_FOUND_MSG');
            break;
          }
        }
        this.toastService.presentToast(errorMsg);
      }
    }).finally(() => {
      this.loader.dismissLoader();
    });
  }

  /**
   * @function redirectToLoginPage
   * This method is used to redirect to login page
   */
  public redirectToLoginPage() {
    this.router.navigate([guardianRouterPath('login')]);
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
   * @function dismissAlert
   * Method to close alert
   */
  public dismissAlert(event) {
    this.pageForm.reset();
    this.submitted = false;
    this.dismissModal();
    this.showSuccessAlert = false;
    if (!this.isAuthenticated) {
      this.redirectToLoginPage();
    }
  }

  /**
   * @function dismissModal
   * Method to close modal
   */
  public dismissModal() {
    this.modalService.dismiss();
  }

  /**
   * @function redirectToDownloadApp
   * This method is used to redirect to download app page
   */
  public redirectToDownloadApp() {
    if (this.isDesktopView) {
      this.router.navigate([guardianRouterPath('appDownload')], { queryParams: { msgType: btoa('SIGNUP_SUCCESS') } });
    }
  }
}
