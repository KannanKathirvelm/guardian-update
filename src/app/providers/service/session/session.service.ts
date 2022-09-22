import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { guardianRouterPathStartWithSlash as guardianRouterPath } from '@constants/router-constants';
import { Storage } from '@ionic/storage';
import { GuardianSessionModel } from '@models/auth/session';
import { TranslationService } from '@providers/service/translation.service';
import { SessionModel } from '@shared/models/auth/session';
import { SessionService } from '@shared/providers/service/session/session.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardianSessionService {

  // -------------------------------------------------------------------------
  // Properties

  private readonly GUARDIAN_STORAGE_KEY = 'gooru_guardian_session';
  private readonly GUARDIAN_INTRO_PLAYED_KEY = 'gooru_guardian_intro_played';
  private readonly GUARDIAN_SIGNUP_DETAILS_KEY = 'goory_guardian_signup_details';
  private guardianSessionSubject: BehaviorSubject<GuardianSessionModel>;
  private currentWardSubject: BehaviorSubject<SessionModel>;
  public currentGuardianSession: Observable<GuardianSessionModel>;
  public skipClearStorageKeys: Array<string>;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private injector: Injector,
    private storage: Storage,
    private translationService: TranslationService,
    private sessionService: SessionService,
  ) {
    this.initSession();
    this.skipClearStorageKeys = [this.GUARDIAN_INTRO_PLAYED_KEY, this.GUARDIAN_SIGNUP_DETAILS_KEY];
  }

  private get _router() { return this.injector.get(Router); }

  public initSession() {
    return this.getSession().then((session) => {
      this.guardianSessionSubject = new BehaviorSubject<GuardianSessionModel>(session);
      this.currentWardSubject = new BehaviorSubject<SessionModel>(null);
      this.currentGuardianSession = this.guardianSessionSubject.asObservable();
    });
  }

  /**
   * @function getSession
   * This Method is used to get the session details from the ionic storage
   */
  public getSession(): Promise<GuardianSessionModel> {
    return this.storage.get(this.GUARDIAN_STORAGE_KEY);
  }

  /**
   * @function guardianUserSession
   * This Method is used to get the current session
   */
  get guardianUserSession(): GuardianSessionModel {
    return this.guardianSessionSubject ? this.guardianSessionSubject.value : null;
  }

  /**
   * @function getCurrentWardSession
   * This Method is used to get the current ward session
   */
  get getCurrentWardSession() {
    return this.currentWardSubject ? this.currentWardSubject.value : null;
  }

  /**
   * @function setSession
   * This Method is used to set the session
   */
  public setSession(userSession) {
    userSession.login_ref_url = this._router.url;
    this.guardianSessionSubject.next(userSession);
    this.storage.set(this.GUARDIAN_STORAGE_KEY, userSession);
  }

  /**
   * @function setGuardianDetailsInStorage
   * This Method is used to set the guardian details in local storage
   */
  public setGuardianDetailsInStorage(type, credentials = null) {
    this.storage.set(this.GUARDIAN_SIGNUP_DETAILS_KEY, {
      type,
      credentials
    });
  }

  /**
   * @function getSavedGuardianDetails
   * This Method is used to get the guardian signup details from local storage
   */
  public getSavedGuardianDetails(): Promise<any> {
    return this.storage.get(this.GUARDIAN_SIGNUP_DETAILS_KEY);
  }

  /**
   * @function setGuardianIntroPlayed
   * This Method is used to set the intro played
   */
  public setGuardianIntroPlayed() {
    this.storage.set(this.GUARDIAN_INTRO_PLAYED_KEY, true);
  }

  /**
   * @function isGuardianIntroPlayed
   * This Method is used to return is guardian intro already played
   */
  public isGuardianIntroPlayed() {
    return new Promise((resolve) => {
      this.storage.get(this.GUARDIAN_INTRO_PLAYED_KEY).then((isPlayed) => {
        resolve(isPlayed);
      });
    });
  }

  /**
   * @function setCurrentImpersonate
   * This Method is used to set current impersonate
   */
  public setCurrentImpersonate(wardSession) {
    this.currentWardSubject.next(wardSession);
  }

  /**
   * @function setWardSession
   * This Method is used to set ward session
   */
  public setWardSession(wardSession) {
    this.sessionService.setSession(wardSession, true);
    this.setCurrentImpersonate(wardSession);
  }

  /**
   * @function getAccessToken
   * This Method is used to get the session details
   */
  public getAccessToken() {
    return new Promise((resolve) => {
      const wardSession = this.getCurrentWardSession;
      if (wardSession) {
        resolve(wardSession.access_token);
      } else {
        this.storage.get(this.GUARDIAN_STORAGE_KEY).then((session) => {
          if (session === null) {
            this.sessionService.signInAsAnonymous().then((sessionModel) => {
              resolve(sessionModel.access_token);
            });
          } else {
            resolve(session.accessToken);
          }
        });
      }
    });
  }

  /**
   * @function clearStorage
   * This Method is used to clear the session storage
   */
  public clearStorage() {
    const storagePromise = new Promise((resolve) => {
      this.storage.forEach((value, key) => {
        const isKeyClearRestrict = this.skipClearStorageKeys.includes(key);
        if (!isKeyClearRestrict) {
          this.storage.remove(key);
        }
      }).then(() => {
        resolve();
      });
    });
    return storagePromise;
  }

  /**
   * @function isAuthenticated
   * This Method is used to check the user is authenticated or not
   */
  public isAuthenticated(): Promise<boolean> {
    return this.storage.get(this.GUARDIAN_STORAGE_KEY).then(session => {
      return this.isLoggedInUser(session);
    });
  }

  /**
   * @function isLoggedInUser
   * This Method is used to check the user is logged in or not
   */
  public isLoggedInUser(session) {
    return (session !== null && session.user_id !== 'anonymous');
  }

  /**
   * @function sessionInValidate
   * This Method is used to clear the storage and redirectTo home page
   */
  public sessionInValidate() {
    this.clearStorage().then(() => {
      this.translationService.initTranslate();
      this.guardianSessionSubject.next(null);
      this._router.navigateByUrl(guardianRouterPath('login'));
    });
  }

  /**
   * @function getCurrentImpersonateWard
   * This Method is used to get impersonate student
   */
  public getCurrentImpersonateWard() {
    return new Promise((resolve) => {
      const wardSession = this.getCurrentWardSession;
      resolve(wardSession);
    });
  }
}
