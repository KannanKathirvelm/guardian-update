import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { GuardianSessionModel } from '@models/auth/session';
import { GuardianParseProvider } from '@providers/apis/parse/parse';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { LocationModel } from '@shared/models/analytics/analytics';
import { UtilsService } from '@shared/providers/service/utils/utils.service';
import { cloneObject } from '@shared/utils/global';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardianParseService {

  private userSessionSubject: BehaviorSubject<GuardianSessionModel>;
  private locationInfoSubject: BehaviorSubject<LocationModel>;

  public get getUserSession() {
    return this.userSessionSubject.value ? this.userSessionSubject.value : null;
  }

  constructor(
    private guardianParseProvider: GuardianParseProvider,
    private utilsService: UtilsService,
    private guardianSessionService: GuardianSessionService
  ) {
    this.locationInfoSubject = new BehaviorSubject<LocationModel>(null);
  }

  /**
   * @function trackEvent
   * This Method is used to post analytic events
   */
  public async trackEvent(eventName, context?) {
    const userSession = this.guardianSessionService.guardianUserSession;
    const locationInfo = await this.fetchLocationInfo();
    const params = {
      eventName,
      userId: userSession && userSession.id || null,
      userName: userSession && userSession.username || null,
      sessionId: this.utilsService.getSessionId(),
      appVersion: environment.APP_VERSION,
      deviceInfo: this.utilsService.deviceInfo(),
      context,
      locationInfo: locationInfo || null,
      tenantId: null,
      tenantShortName: null
    };
    return this.guardianParseProvider.trackEvent(params);
  }

  /**
   * @function trackErrorLog
   * This Method is used to post error logs
   */
  public async trackErrorLog(errorType, errorMessage, url?, statusCode?) {
    const userSession = this.guardianSessionService.guardianUserSession;
    const locationInfo = await this.fetchLocationInfo();
    const params = {
      errorType,
      userId: userSession && userSession.id ? userSession.id : null,
      sessionId: this.utilsService.getSessionId(),
      appVersion: environment.APP_VERSION,
      deviceInfo: this.utilsService.deviceInfo(),
      locationInfo: locationInfo || null,
      log: JSON.stringify(errorMessage),
      apiPath: url,
      apiStatusCode: statusCode
    };
    return this.guardianParseProvider.trackErrorLog(params);
  }

  /**
   * @function fetchLocationInfo
   * This method used to get the location info
   */
  public fetchLocationInfo() {
    return new Promise((resolve, reject) => {
      const location = this.locationInfo;
      if (location) {
        resolve(location);
      } else {
        this.guardianParseProvider.fetchLocationInfo().then((response) => {
          this.locationInfoSubject.next(response);
          resolve(response);
        }, reject);
      }
    });
  }

  get locationInfo() {
    return this.locationInfoSubject ? cloneObject(this.locationInfoSubject.value) : null;
  }
}
