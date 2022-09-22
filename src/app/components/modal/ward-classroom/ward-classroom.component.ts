import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { WardModel } from '@models/ward/ward';
import { GuardianClassService } from '@providers/service/class/class.service';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { WardService } from '@providers/service/ward/ward.service';
import { CALENDAR_VIEW } from '@shared/constants/helper-constants';
import { routerPathIdReplace } from '@shared/constants/router-constants';
import { ClassModel } from '@shared/models/class/class';
import * as moment from 'moment';

@Component({
  selector: 'nav-ward-classroom',
  templateUrl: './ward-classroom.component.html',
  styleUrls: ['./ward-classroom.component.scss'],
})

export class WardClassroomComponent implements OnChanges {

  // -------------------------------------------------------------------------
  // Properties

  public studentDetail: WardModel;
  public isLoaded: boolean;
  public classList: Array<ClassModel>;
  @Input() public ward: WardModel;
  @Input() public showClassroomWard: boolean;
  @Output() public closeWardPullUp = new EventEmitter();
  @Output() public isWardClassroomLoaded = new EventEmitter();

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private router: Router,
    private guardianClassService: GuardianClassService,
    private wardService: WardService,
    private guardianSessionService: GuardianSessionService
  ) {
  }

  // -------------------------------------------------------------------------
  // life cycle methods

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.ward && changes.ward.currentValue) {
      this.classList = null;
      this.setStudentDetails(this.ward);
      this.fetchClassList();
    }
  }

  // -------------------------------------------------------------------------
  // methods

  /**
   * @function fetchClassList
   * Method to fetch class list
   */
  public fetchClassList() {
    this.isLoaded = false;
    this.isWardClassroomLoaded.emit({ isLoaded: false });
    this.guardianClassService.fetchClassList().then((classList) => {
      this.classList = classList;
      setTimeout(() => {
        this.isLoaded = true;
        setTimeout(() => {
          this.isWardClassroomLoaded.emit({ isLoaded: true });
        }, 100);
      }, 1500);
    });
  }

  /**
   * @function setStudentDetails
   * Method to set the student details
   */
  private setStudentDetails(studentDetail) {
    this.studentDetail = {
      classesCount: studentDetail.classesCount,
      first_name: studentDetail.first_name,
      gradeName: studentDetail.gradeName,
      last_name: studentDetail.last_name,
      schoolName: studentDetail.schoolName,
      tenantId: studentDetail.tenantId,
      thumbnail: studentDetail.thumbnail,
      user_id: studentDetail.user_id,
      username: studentDetail.username,
      inviteStatus: studentDetail.inviteStatus,
      isInvitedByStudent: studentDetail.isInvitedByStudent,
      status: studentDetail.status
    };
  }

  /**
   * @function closeModal
   * Method to close modal
   */
  public closeModal() {
    this.guardianSessionService.setCurrentImpersonate(null);
    this.onCloseWardPullUp();
  }

  /**
   * @function onCloseWardPullUp
   * Method to close ward pullup
   */
  private onCloseWardPullUp() {
    this.closeWardPullUp.emit();
  }

  /**
   * @function openWardClass
   * Method to fetch ward class details
   */
  public openWardClass(wardClass) {
    this.wardService.fetchWardCADetails(wardClass.id).then((classActivityCount) => {
      wardClass.classActivityCount = classActivityCount;
    });
  }

  /**
   * @function redirectToProficiency
   * Method to redirect to proficiency
   */
  public redirectToProficiency(classDetail) {
    this.onCloseWardPullUp();
    const proficiencyURL = routerPathIdReplace('proficiency', classDetail.id);
    if (classDetail.isPublic) {
      this.router.navigate([proficiencyURL], { queryParams: { isPublic: true } });
    } else {
      this.router.navigate([proficiencyURL]);
    }
  }

  /**
   * @function redirectToClassActivity
   * Method to redirect to class activity
   */
  public redirectToClassActivity(classId) {
    this.onCloseWardPullUp();
    const classActivityURL = routerPathIdReplace('classActivityFullPath', classId);
    this.router.navigate([classActivityURL]);
  }

  /**
   * @function redirectToLearningJourney
   * Method to redirect to learning journey page
   */
  public redirectToLearningJourney(classId) {
    this.onCloseWardPullUp();
    const learningJourneyURL = routerPathIdReplace('home', classId);
    this.router.navigate([learningJourneyURL]);
  }

  /**
   * @function redirectToNextWeekClassActivity
   * Method to redirect to next week of class activity
   */
  public redirectToNextWeekClassActivity(classId) {
    const nextWeekStartDate = moment().add(1, 'weeks').startOf('week').format(CALENDAR_VIEW.DATE_FORMAT);
    this.onCloseWardPullUp();
    const classActivityURL = routerPathIdReplace('classActivityFullPath', classId);
    this.router.navigate([classActivityURL], { queryParams: { date: nextWeekStartDate } });
  }

  /**
   * @function redirectToCourseMilestone
   * Method to redirect to course map or class activity
   */
  public redirectToCourseMilestone(classDetail) {
    this.onCloseWardPullUp();
    if (classDetail.isPremiumClass) {
      this.redirectToMilestone(classDetail);
    } else {
      this.redirectToCourseMap(classDetail);
    }
  }

  /**
   * @function redirectToMilestone
   * Method to redirect to milestone
   */
  public redirectToMilestone(classDetail) {
    const milestoneURL = routerPathIdReplace('milestone', classDetail.id);
    if (classDetail.isPublic) {
      this.router.navigate([milestoneURL], { queryParams: { isPublic: true } });
    } else {
      this.router.navigate([milestoneURL]);
    }
  }

  /**
   * @function redirectToCourseMap
   * Method to redirect to course map
   */
  public redirectToCourseMap(classDetail) {
    const courseMapURL = routerPathIdReplace('courseMap', classDetail.id);
    if (classDetail.isPublic) {
      this.router.navigate([courseMapURL], { queryParams: { isPublic: true } });
    } else {
      this.router.navigate([courseMapURL]);
    }
  }
}
