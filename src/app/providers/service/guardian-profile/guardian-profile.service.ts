import { Injectable } from '@angular/core';
import { GuardianProfileProvider } from '@providers/apis/guardian-profile/guardian-profile';
import { GuardianSessionService } from '@providers/service/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class GuardianProfileService {

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private guardianProfileProvider: GuardianProfileProvider,
    private guardianSessionService: GuardianSessionService
  ) {
  }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function forgotPassword
   * This method is used to verify email for forgot password
   */
  public forgotPassword(email) {
    return this.guardianProfileProvider.forgotPassword(email);
  }

  /**
   * @function resetPassword
   * This method is used to reset the password
   */
  public resetPassword(password, token) {
    return this.guardianProfileProvider.resetPassword(password, token);
  }

  /**
   * @function approveAccount
   * This method is used to approve account
   */
  public approveAccount(params) {
    return this.guardianProfileProvider.approveAccount(params);
  }

  /**
   * @function updateEmailVerification
   * this method used to verify email
   */
  public updateEmailVerification(token) {
    return this.guardianProfileProvider.updateEmailVerification(token);
  }

  /**
   * @function updateEmailVerification
   * this method used to verify email
   */
  public resendVerificationEmail(emailId) {
    return this.guardianSessionService.getAccessToken().then((token) => {
      return this.guardianProfileProvider.resendVerificationEmail(emailId, token);
    });
  }
}
