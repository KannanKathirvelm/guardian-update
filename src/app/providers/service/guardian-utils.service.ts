import { Injectable } from '@angular/core';
import { EXTERNAL_APP_PACKAGES } from '@constants/helper-constants';
import { AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { UtilsService } from '@shared/providers/service/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class GuardianUtilsService {

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(private utilsService: UtilsService) { }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function openNavigatorApp
   * This method used to open learner app
   */
  public openNavigatorApp() {
    const options: AppLauncherOptions = {};
    if (this.utilsService.isAndroid()) {
      options.packageName = EXTERNAL_APP_PACKAGES.ANDROID_NAVIGATOR_APP;
    } else {
      options.packageName = EXTERNAL_APP_PACKAGES.IOS_NAVIGATOR_APP;
    }
    this.utilsService.launchApp(options, EXTERNAL_APP_PACKAGES.ANDROID_NAVIGATOR_APP,
      EXTERNAL_APP_PACKAGES.IOS_NAVIGATOR_APP);
  }
}
