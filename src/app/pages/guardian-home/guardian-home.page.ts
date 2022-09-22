import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerRequestAccessComponent } from '@components/modal/learner-request-access/learner-request-access.component';
import { IonInput } from '@ionic/angular';
import { WardModel } from '@models/ward/ward';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '@providers/service/app.service';
import { ModalService } from '@providers/service/modal.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { WardService } from '@providers/service/ward/ward.service';
import { LoadingService } from '@shared/providers/service/loader.service';
import { ProfileService } from '@shared/providers/service/profile/profile.service';
import { ToastService } from '@shared/providers/service/toast.service';

@Component({
  selector: 'guardian-home',
  templateUrl: 'guardian-home.page.html',
  styleUrls: ['guardian-home.page.scss'],
})
export class GuardianHomePage {

  // -------------------------------------------------------------------------
  // Properties

  public wardList: Array<WardModel>;
  public isShowSearchBar: boolean;
  public searchText: string;
  public isLoaded: boolean;
  public showSuccessAlert: boolean;
  public showClassroomWard: boolean;
  public ward: WardModel;
  public successMessage: string;
  public classLoaded: boolean;
  @ViewChild(IonInput, null) public search: IonInput;
  @ViewChild('wardClassRoomRef', { static: true }) public wardClassRoomRef: ElementRef;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private modalService: ModalService,
    private guardianSessionService: GuardianSessionService,
    private wardService: WardService,
    private translate: TranslateService,
    private toastService: ToastService,
    private loader: LoadingService,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.successMessage = this.translate.instant('STUDENT_APPROVE_SUCCESS_MSG');
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.isImpersonate) {
        this.guardianSessionService.getCurrentImpersonateWard().then((student) => {
          Object.assign(student, { status: true });
          this.impersonateWardClass(student);
          this.router.navigate([], {
            queryParams: { isImpersonate: null },
            queryParamsHandling: 'merge'
          });
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // lifecycle methods

  public ionViewDidEnter() {
    this.appService.initialize();
    this.profileService.fetchRoleRelationshipList();
    this.fetchWardList();
    this.guardianSessionService.setCurrentImpersonate(null);
  }

  // -------------------------------------------------------------------------
  // methods

  /**
   * @function fetchWardList
   * Method to fetch student list
   */
  public fetchWardList() {
    this.isLoaded = false;
    this.wardService.fetchWardList().then((wardListResponse) => {
      this.wardList = wardListResponse;
      this.isLoaded = true;
      if (this.wardList && this.wardList.length === 1) {
        this.impersonateWardClass(this.wardList[0]);
      }
    });
  }

  /**
   * @function toggleSearchBar
   * Method to toggle the searchbar
   */
  public toggleSearchBar() {
    this.isShowSearchBar = !this.isShowSearchBar;
    this.searchText = '';
    if (this.isShowSearchBar) {
      setTimeout(() => { this.search.setFocus(); }, 150);
    }
  }

  /**
   * @function impersonateWardClass
   * Method to open ward class
   */
  public impersonateWardClass(ward) {
    if (ward.status) {
      this.loader.displayLoader();
      this.wardService.impersonateWard(ward.user_id).then(() => {
        this.ward = ward;
        this.showClassroomWard = true;
      }).catch(() => {
        this.displayToast('SIGN_IN_CREDENTIALS_NOT_VALID');
      }).finally(() => {
        this.loader.dismissLoader();
      });
    }
  }

  /**
   * @function closeWardPullUp
   * This method is used to close the ward pullup
   */
  public closeWardPullUp() {
    this.wardService.toggleImpersonateWard(this.ward.user_id);
    this.showClassroomWard = false;
  }

  /**
   * @function displayToast
   * This method is used to display toast
   */
  private displayToast(errorMessage) {
    this.translate
      .get(errorMessage)
      .subscribe(value => {
        this.toastService.presentToast(value);
      });
  }

  /**
   * @function filterClassList
   * Method to is used to filter the search text
   */
  public filterClassList(evt) {
    const searchTerm = evt.srcElement.value;
    this.searchText = searchTerm;
  }

  /**
   * @function requestAccess
   * this Method is used to request access
   */
  public requestAccess() {
    this.modalService.open(LearnerRequestAccessComponent, {}, 'request-access-modal').then(() => {
      this.fetchWardList();
    });
  }

  /**
   * @function approveStudentRequest
   * this Method is used to approve student request
   */
  public approveStudentRequest(studentId) {
    this.wardService.approveStudentRequest(studentId).then(() => {
      this.showSuccessAlert = true;
    });
  }

  /**
   * @function dismissAlert
   * Method to close alert
   */
  public dismissAlert(value) {
    if (value) {
      this.fetchWardList();
      this.modalService.dismiss();
      this.showSuccessAlert = false;
    }
  }

  /**
   * @function wardClassroomLoaded
   * Method to return if classroom loaded
   */
  public wardClassroomLoaded(event) {
    this.classLoaded = event.isLoaded;
  }
}
