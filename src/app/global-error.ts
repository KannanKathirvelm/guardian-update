import { ErrorHandler, Injectable } from '@angular/core';
import { GuardianParseService } from '@providers/service/parse/parse.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { ERROR_TYPES } from '@shared/constants/helper-constants';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private guardianParseService: GuardianParseService,
    private guardianSessionService: GuardianSessionService
  ) {
    super();
  }

  /**
   * @function handleError
   * This Method is used to log the error in the parse server
   */
  public handleError(error) {
    const userSession = this.guardianSessionService.guardianUserSession;
    const userMessage = userSession
      ? `User ${userSession.id}`
      : 'User not logged in';
    let errorMessage = `${userMessage} - Error: `;
    if (error.message) {
      errorMessage = `${errorMessage}${error.message}`;
    } else {
      errorMessage = `${errorMessage} Unknow Error`;
    }
    // tslint:disable-next-line
    console.error(error);
    const isFatalError = error.message && !error.message.includes('HttpError');
    const errorType = isFatalError ? ERROR_TYPES.FATAL : ERROR_TYPES.NON_FATAL;
    this.guardianParseService.trackErrorLog(errorType, errorMessage);
  }
}
