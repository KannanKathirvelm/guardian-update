import { Injectable } from '@angular/core';
import { WardModel } from '@models/ward/ward';
import { WardProvider } from '@providers/apis/ward/ward';
import { AuthService } from '@providers/service/auth/auth.service';
import { CALENDAR_VIEW } from '@shared/constants/helper-constants';
import { ClassActivityService } from '@shared/providers/service/class-activity/class-activity.service';
import { ProfileService } from '@shared/providers/service/profile/profile.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WardService {

  // -------------------------------------------------------------------------
  // Properties

  public wardListSubject: BehaviorSubject<Array<WardModel>>;
  public wardListObservable: Observable<Array<WardModel>>;


  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private wardProvider: WardProvider,
    private authService: AuthService,
    private classActivityService: ClassActivityService,
    private profileService: ProfileService
  ) {
    this.wardListSubject = new BehaviorSubject<Array<WardModel>>([]);
    this.wardListObservable = this.wardListSubject.asObservable();
  }

  // -------------------------------------------------------------------------
  // methods

  /**
   * @function fetchWardList
   * This method is used to fetch student list
   */
  public fetchWardList() {
    return this.wardProvider.fetchWardList().then((wardListResponse) => {
      this.wardListSubject.next(wardListResponse);
      return wardListResponse;
    });
  }

  get wardList(): Array<WardModel> {
    return this.wardListSubject ? this.wardListSubject.value : [];
  }

  /**
   * @function impersonateWard
   * This method is used to impersonate student
   */
  public impersonateWard(userId) {
    return this.wardProvider.impersonateWard(userId).then((accessToken) => {
      return this.authService.studentLogin(accessToken).then(() => {
        const impersonateStudent = this.wardListSubject.value.find((item) => item.user_id === userId);
        if (impersonateStudent) {
          impersonateStudent.isImpersonate = true;
        }
        return this.fetchProfilePreference();
      });
    });
  }

  /**
   * @function toggleImpersonateWard
   * This method is used to toggle impersonated student card
   */
  public toggleImpersonateWard(userId) {
    const impersonateStudent = this.wardListSubject.value.find((item) => item.user_id === userId);
    if (impersonateStudent) {
      impersonateStudent.isImpersonate = !impersonateStudent.isImpersonate;
    }
  }

  /**
   * @function fetchWardCADetails
   * This method is used to fetch class related details
   */
  public fetchWardCADetails(classId) {
    const todayDate = moment();
    const currentWeekStartDate = todayDate.weekday(0).format(CALENDAR_VIEW.DATE_FORMAT);
    const currentWeekEndDate = todayDate.weekday(6).format(CALENDAR_VIEW.DATE_FORMAT);
    const nextWeekStartDate = moment().add(1, 'weeks').startOf('week').format(CALENDAR_VIEW.DATE_FORMAT);
    const nextWeekEndDate = moment().add(1, 'weeks').endOf('week').format(CALENDAR_VIEW.DATE_FORMAT);
    return Promise.all([
      this.classActivityService.fetchActivityList(classId, currentWeekStartDate, currentWeekEndDate, false),
      this.classActivityService.fetchActivityList(classId, nextWeekStartDate, nextWeekEndDate, false),
    ]).then((values) => {
      const currentWeekClassActivityList = values[0];
      const nextWeekClassActivityList = values[1];
      const classActivityCount = {
        currentWeekCount: currentWeekClassActivityList.length,
        nextWeekCount: nextWeekClassActivityList.length
      };
      return classActivityCount;
    });
  }

  /**
   * @function fetchProfilePreference
   * Method to fetch profile preference
   */
  private fetchProfilePreference() {
    return this.profileService.fetchProfilePreference();
  }

  /**
   * @function inviteToStudent
   * Method to invite to student
   */
  public inviteToStudent(emailId, relationshipId) {
    return this.wardProvider.inviteToStudent(emailId, relationshipId);
  }

  /**
   * @function approveStudentRequest
   * Method to approve student request
   */
  public approveStudentRequest(studentId) {
    return this.wardProvider.approveStudentRequest(studentId);
  }
}
