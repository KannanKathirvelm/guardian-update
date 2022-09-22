import { Injectable } from '@angular/core';
import { TenantListModel } from '@app/shared/models/auth/tenant';
import { GuardianSessionModel } from '@models/auth/session';
import { HttpService } from '@providers/apis/http';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { SessionModel } from '@shared/models/auth/session';

@Injectable({
  providedIn: 'root'
})
export class AuthProvider {

  // -------------------------------------------------------------------------
  // Properties

  private authNamespace = 'api/nucleus-auth';
  private guardianAuthNamespace = 'api/guardian/v1';

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private httpService: HttpService,
    private guardianSessionService: GuardianSessionService
  ) { }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function guardianSignInWithCredentail
   * This method is used to sign in with username and password of guardian
   */
  public signInWithCredential(usernameOrEmail: string, password: string) {
    const endpoint = `${this.guardianAuthNamespace}/gd-users/auth/login`;
    const token = `${usernameOrEmail}:${password}`;
    const headers = this.httpService.getBasicHeaders(token);
    const reqOpts = { headers };
    return this.httpService.post<GuardianSessionModel>(endpoint, {}, reqOpts)
      .then((result) => {
        const sessionData = this.normalizeGuardianSession(result.data);
        return sessionData;
      });
  }

  /**
   * @function signInWithToken
   * This method is used to sign in with token
   */
  public signInWithToken(token: string) {
    const endpoint = `${this.authNamespace}/v2/token`;
    const headers = this.httpService.getTokenHeaders(token);
    return this.httpService.get<SessionModel>(endpoint, null, headers).then((result) => {
      const studentSession = this.normalizeStudentSession(result.data);
      return this.guardianSessionService.setWardSession(studentSession);
    });
  }

  /**
   * @function signInWithSSOToken
   * This method is used to sign in with token
   */
  public signInWithSSOToken(token: string) {
    const endpoint = `${this.guardianAuthNamespace}/gd-users/token`;
    const headers = this.httpService.getTokenHeaders(token);
    return this.httpService.get<SessionModel>(endpoint, null, headers).then((result) => {
      return this.normalizeGuardianSession(result.data);
    });
  }

  /**
   * @function signupGuardian
   * This method is used to create new guardian
   */
  public signupGuardian(signupFormContent) {
    const endpoint = `${this.guardianAuthNamespace}/nav-users/guardians`;
    return this.httpService.post<GuardianSessionModel>(endpoint, signupFormContent).then((result) => {
      return this.normalizeGuardianSession(result.data);
    });
  }

  /**
   * @function signOut
   * This method is used to sign out.
   */
  public logOut() {
    const endpoint = `${this.guardianAuthNamespace}/gd-users/auth/logout`;
    const token = this.guardianSessionService.guardianUserSession.accessToken;
    const headers = this.httpService.getTokenHeaders(token);
    return this.httpService.delete(endpoint, null, headers);
  }

  // -------------------------------------------------------------------------
  // normalize methods

  /**
   * @function normalizeGuardianSession
   * This method is used to normalize session
   */
  private normalizeGuardianSession(payload): GuardianSessionModel {
    const userSessionData: GuardianSessionModel = {
      accessToken: payload.accessToken,
      email: payload.email,
      firstname: payload.firstname,
      id: payload.id,
      lastname: payload.lastname,
      providedAt: payload.providedAt,
      username: payload.username,
      thumbnail: payload.thumbnail || null
    };
    return userSessionData;
  }

  /**
   * @function normalizeStudentSession
   * This method is used to normalize student session
   */
  private normalizeStudentSession(payload): SessionModel {
    const studentSession: any = {
      access_token: payload.access_token,
      access_token_validity: payload.access_token_validity,
      appId: payload.app_id,
      cdn_urls: payload.cdn_urls,
      email: payload.email,
      partnerId: payload.partner_id,
      provided_at: payload.provided_at,
      tenant: this.normalizeTenant(payload.tenant || {}),
      user_id: payload.user_id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      username: payload.username,
      user_category: payload.user_category,
      thumbnail: payload.thumbnail ? `${payload.cdn_urls.user_cdn_url}${payload.thumbnail}` : null,
    };
    return studentSession;
  }

  /**
   * @function normalizeTenant
   * This method is used to normalize tenant
   */
  private normalizeTenant(payload): any {
    const tenant: any = {
      imageUrl: payload.image_url || null,
      settings: payload.settings,
      shortName: payload.short_name || null,
      tenantName: payload.name || null,
      tenantId: payload.tenant_id,
      tenantRoot: payload.tenant_root
    };
    return tenant;
  }

  /**
   * @function fetchTenantList
   * This Method is used to get student list based on tenant
   */
  public fetchTenantList(email: string, token) {
    const postData = {
      email
    };
    const endpoint = `${this.authNamespace}/v2/users/accounts`;
    const headers = this.httpService.getTokenHeaders(token);
    const reqOpts = { headers };
    return this.httpService.post(endpoint, postData, reqOpts)
    .then((tenantListResponse) => {
      const tenantList = tenantListResponse.data.user_accounts;
      return tenantList.map((item) => {
        return this.normalizeTenantList(item);
      });
    });
  }

  /**
   * @function normalizeTenantList
   * This Method is used to normalize the tenant
   */
  public normalizeTenantList(tenant) {
    const tenantModel: TenantListModel = {
      tenantId: tenant.tenant_id,
      image_url: tenant.image_url,
      login_type: tenant.login_type,
      tenant_name: tenant.tenant_name,
      short_name: tenant.short_name,
      settings: tenant.settings,
      tenant_short_name: tenant.tenant_short_name || tenant.short_name
    };
    return tenantModel;
  }
}
