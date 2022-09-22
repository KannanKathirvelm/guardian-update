import { Store } from '@ngrx/store';
import { AuthProvider } from '@providers/apis/auth/auth';
import { LoadingService } from '@providers/service/loader.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { Logout } from '@shared/stores/logout.reset';

export class AppLogout {

  constructor(
    private store: Store,
    private authProvider: AuthProvider,
    private guardianSessionService: GuardianSessionService,
    private loader: LoadingService
  ) { }

  public execute() {
    this.loader.displayLoader();
    this.authProvider.logOut().then(() => {
      this.guardianSessionService.sessionInValidate();
      this.store.dispatch(new Logout());
    }).finally(() => {
      this.loader.dismissLoader();
    });
  }
}
