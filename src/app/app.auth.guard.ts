import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { GuardianUtilsService } from '@providers/service/utils/utils.service';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    private guardianSessionService: GuardianSessionService,
    private guardianUtilsService: GuardianUtilsService
  ) { }

  public canActivate() {
    return this.isAuthenticated();
  }

  private isAuthenticated(): Promise<boolean> {
    return this.guardianSessionService.isAuthenticated().then(authenticated => {
      return authenticated && (!this.guardianUtilsService.isBrowser());
    });
  }
}
