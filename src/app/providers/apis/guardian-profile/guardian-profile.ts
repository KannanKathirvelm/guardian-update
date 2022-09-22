import { Injectable } from '@angular/core';
import { HttpService } from '@providers/apis/http';

@Injectable({
  providedIn: 'root'
})

export class GuardianProfileProvider {

  // -------------------------------------------------------------------------
  // Properties

  private guardianNamespace = 'api/guardian/v1';

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private httpService:
    HttpService
  ) { }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function forgotPassword
   * This Method is used to sent the forgot password
   */
  public forgotPassword(email: string) {
    const endpoint = `${this.guardianNamespace}/gd-users/users/forgot-password`;
    const params = { email };
    return this.httpService.post(endpoint, params);
  }

  /**
   * @function resetPassword
   * This Method is used to reset the password
   */
  public resetPassword(password, token) {
    const params = {
      newPassword: password,
      token
    };
    const endpoint = `${this.guardianNamespace}/gd-users/users/reset-password`;
    return this.httpService.put(endpoint, params);
  }

  /**
   * @function approveAccount
   * This Method is used to approve account
   */
  public approveAccount(params) {
    const endpoint = `${this.guardianNamespace}/gd-users/users/approve`;
    return this.httpService.put(endpoint, params);
  }

  /**
   * @function updateEmailVerification
   * This Method is used to update the email verification
   */
  public updateEmailVerification(token: string) {
    const endpoint = `${this.guardianNamespace}/gd-users/guardians/email/verify`;
    const params = { token };
    return this.httpService.put(endpoint, params);
  }

  /**
   * @function verifyUserEmail
   * This method is used to verify user email id
   */
  public resendVerificationEmail(email, token) {
    const endpoint = `${this.guardianNamespace}/gd-users/guardians/email/resend`;
    const params = { email };
    const headers = this.httpService.getTokenHeaders(token);
    const reqOpts = { headers };
    return this.httpService.post<string>(endpoint, params, reqOpts);
  }
}
