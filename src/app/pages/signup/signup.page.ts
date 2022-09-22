import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { guardianRouterPath } from '@constants/router-constants';
import { GuardianUtilsService } from '@providers/service/utils/utils.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements AfterViewInit {

  // -------------------------------------------------------------------------
  // Properties

  public isRedirectToIntroSlider: boolean;
  public isPlatformDesktop: boolean;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private guardianUtilsService: GuardianUtilsService,
    private elementRef: ElementRef
  ) {
    const isRedirectToIntro = this.activatedRoute.snapshot.queryParams['introSlider'];
    this.isRedirectToIntroSlider = isRedirectToIntro ? isRedirectToIntro : false;
    this.isPlatformDesktop = this.guardianUtilsService.isBrowser();
  }

  // -------------------------------------------------------------------------
  // lifecycle methods

  public ngAfterViewInit() {
    if (this.isPlatformDesktop) {
      const elementNativeElement = this.elementRef.nativeElement;
      this.guardianUtilsService.customFadeInAnimation(elementNativeElement);
    }
  }

  // -------------------------------------------------------------------------
  // methods

  /**
   * @function redirectToLoginPage
   * This method is used to redirect to login page
   */
  public redirectToLoginPage() {
    if (this.isRedirectToIntroSlider) {
      this.router.navigate([guardianRouterPath('introSlider')]);
    } else {
      this.router.navigate([guardianRouterPath('login')]);
    }
  }
}
