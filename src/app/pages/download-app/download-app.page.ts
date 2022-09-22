import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOWNLOAD_APP_MSG } from '@constants/helper-constants';
import { guardianRouterPath } from '@constants/router-constants';
import { TranslateService } from '@ngx-translate/core';
import { GuardianUtilsService } from '@providers/service/utils/utils.service';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.page.html',
  styleUrls: ['./download-app.page.scss'],
})
export class DownloadAppPage implements AfterViewInit {

  // -------------------------------------------------------------------------
  // Properties

  public message: string;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private elementRef: ElementRef,
    private guardianUtilsService: GuardianUtilsService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.msgType) {
        const decodeType = atob(params.msgType);
        this.message = this.translate.instant(DOWNLOAD_APP_MSG[decodeType]);
        // clear query params
        this.router.navigate([], {
          queryParams: { msgType: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // life cycle methods

  public ngAfterViewInit() {
    const elementNativeElement = this.elementRef.nativeElement;
    this.guardianUtilsService.customFadeInAnimation(elementNativeElement);
  }

  // -------------------------------------------------------------------------
  // methods

  /**
   * @function redirectToDownloadApp
   * This method is used to redirect to download app page
   */
  public redirectToDownloadApp() {
    this.router.navigate([guardianRouterPath('login')]);
  }
}
