import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { guardianRouterPathStartWithSlash as guardianRouterPath } from '@constants/router-constants';
import { environment } from '@environment/environment';
import { NavController } from '@ionic/angular';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { GuardianUtilsService } from '@providers/service/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthGuardService implements CanActivate {

  constructor(
    private guardianSessionService: GuardianSessionService,
    private guardianUtilsService: GuardianUtilsService,
    private navCtrl: NavController
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.guardianSessionService.isAuthenticated().then((authenticated) => {
      if (this.guardianUtilsService.isBrowser() && !route.data.isAllowInBrowser) {
        window.location.href = environment.WEB_APP_GUARDIAN_PAGE_URL;
        return;
      }
      if (authenticated) {
        this.navCtrl.navigateForward(guardianRouterPath('guardianHome'));
      }
      return !authenticated;
    });
  }
}
