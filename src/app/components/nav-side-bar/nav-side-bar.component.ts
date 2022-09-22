import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LANGUAGE } from '@constants/translate-constants';
import { environment } from '@environment/environment';
import { MenuController } from '@ionic/angular';
import { GuardianSessionModel } from '@models/auth/session';
import { WardModel } from '@models/ward/ward';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '@providers/service/translation.service';
import { WardService } from '@providers/service/ward/ward.service';
import { routerPath } from '@shared/constants/router-constants';

@Component({
  selector: 'nav-side-bar',
  templateUrl: './nav-side-bar.component.html',
  styleUrls: ['./nav-side-bar.component.scss'],
})
export class NavSideBarComponent implements OnInit, OnChanges {

  // -------------------------------------------------------------------------
  // Properties

  @Input() public userSession: GuardianSessionModel;
  @Output() public logout = new EventEmitter();
  public wardList: Array<WardModel>;
  public showNgxAvatar: boolean;
  public languageList: Array<{ label: string, value: string }>;
  public defaultLanguage: string;

  get appVersion() {
    return environment.APP_VERSION;
  }

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private translationService: TranslationService,
    private menuCtrl: MenuController,
    private translate: TranslateService,
    private wardService: WardService,
    private router: Router
  ) {
    this.languageList = [];
  }

  // -------------------------------------------------------------------------
  // lifecycle method

  public ngOnInit() {
    this.translationService.getLanguage().then((languageItem) => {
      this.defaultLanguage = languageItem;
    });
    this.languageList = LANGUAGE;
    this.handleAvatarImage();
    this.fetchWardList();
  }

  public ngOnChanges(changes: SimpleChanges) {
    this.handleAvatarImage();
  }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function fetchWardList
   * This Method is used to fetch student list.
   */
  public fetchWardList() {
    this.wardService.wardListObservable.subscribe((wardListResponse) => {
      this.wardList = wardListResponse.filter((item) => item.status);
    });
  }

  /**
   * @function handleAvatarImage
   * This Method is used to handle avatar image.
   */
  public handleAvatarImage() {
    this.showNgxAvatar = this.userSession && !this.userSession.thumbnail;
  }

  /**
   * @function onLogout
   * This Method is used to logout.
   */
  public onLogout() {
    this.menuCtrl.close().then((isClosed) => {
      if (isClosed) {
        this.logout.emit();
      }
    });
  }

  /**
   * @function closeMenu
   * This Method is used to close the side menu
   */
  public closeMenu() {
    this.menuCtrl.close();
  }

  /**
   * @function imageErrorHandler
   * This Method is used to set ngx avatar if image error
   */
  public imageErrorHandler() {
    this.showNgxAvatar = !this.showNgxAvatar;
  }

  /**
   * @function changeLanguage
   * This Method is used to change the language of app
   */
  public changeLanguage(event) {
    const selectedLanguage = event.detail.value;
    this.translate.use(selectedLanguage);
    this.translationService.setLanguage(selectedLanguage);
  }

  /**
   * @function redirectToStudentPortfolio
   * This Method is used to redirect to student portfolio
   */
  public redirectToStudentPortfolio(student) {
    this.menuCtrl.close().then((isClosed) => {
      if (isClosed) {
        this.wardService.impersonateWard(student.user_id).then(() => {
          const portfolioPage = routerPath('portfolio');
          this.router.navigate([portfolioPage], { queryParams: { userId: student.user_id } });
        });
      }
    });
  }

  /**
   * @function redirectToStudentProficiency
   * This Method is used to redirect to student proficiency
   */
  public redirectToStudentProficiency(student) {
    this.menuCtrl.close().then((isClosed) => {
      if (isClosed) {
        this.wardService.impersonateWard(student.user_id).then(() => {
          const myLearnerIdentityPage = routerPath('myLearnerIdentity');
          this.router.navigate([myLearnerIdentityPage], { queryParams: { userId: student.user_id } });
        });
      }
    });
  }
}
