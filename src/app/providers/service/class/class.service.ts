import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClassModel } from '@shared/models/class/class';
import { TaxonomySubjectModel } from '@shared/models/taxonomy/taxonomy';
import { ClassProvider } from '@shared/providers/apis/class/class';
import { CompetencyProvider } from '@shared/providers/apis/competency/competency';
import { CourseProvider } from '@shared/providers/apis/course/course';
import { PerformanceProvider } from '@shared/providers/apis/performance/performance';
import { setClassMembers } from '@shared/stores/actions/class-members.action';
import { getClassMembersByClassId } from '@shared/stores/reducers/class-members.reducer';
import { cloneObject } from '@shared/utils/global';
import { BehaviorSubject } from 'rxjs';
import { AnonymousSubscription } from 'rxjs/Subscription';

@Injectable({
  providedIn: 'root'
})
export class GuardianClassService {

  public classSubject: BehaviorSubject<ClassModel>;
  public classTaxonomySubject: BehaviorSubject<TaxonomySubjectModel>;
  public classStoreSubscription: AnonymousSubscription;

  constructor(
    private store: Store,
    private classProvider: ClassProvider,
    private courseProvider: CourseProvider,
    private competencyProvider: CompetencyProvider,
    private performanceProvider: PerformanceProvider,
  ) {
    this.classSubject = new BehaviorSubject<ClassModel>(null);
    this.classTaxonomySubject = new BehaviorSubject<TaxonomySubjectModel>(null);
  }

  /**
   * @function fetchClassList
   * Method to fetch classes
   */
  public fetchClassList(): Promise<Array<ClassModel>> {
    return new Promise((resolve, reject) => {
      this.classProvider.fetchClassList().then((classList) => {
        let activeClasses = this.getActiveClasses(classList);
        const members = classList.member;
        activeClasses = this.orderByMemberId(activeClasses, members);
        activeClasses = this.addTeacherToClass(activeClasses, classList.teacherDetails);
        const courseIds = this.courseProvider.getListOfCourseIds(activeClasses);
        if (courseIds && courseIds.length) {
          this.courseProvider.fetchCourseList(courseIds).then((courses) => {
            activeClasses.map((activeClass) => {
              const course = courses.find((courseItem) => {
                return courseItem.id === activeClass.course_id;
              });
              activeClass.course = course;
              return activeClass;
            });
            const nonPremiumClasses = this.getNonPremiumClasses(activeClasses);
            const nonPremiumClassIds = this.getListOfClassIds(nonPremiumClasses);
            const premiumClasses = this.getPremiumClasses(activeClasses);
            const premiumClassCourseIds = this.courseProvider.getListOfCourseIds(premiumClasses, true);
            const permiumClassSubjectIds = this.getListOfClassSubCodeIds(premiumClasses);
            if (premiumClassCourseIds.length) {
              this.performanceProvider.fetchClassPerformance(premiumClassCourseIds).then(performanceSummary => {
                const performanceKey = 'performanceSummary';
                this.setPerformanceSummary(activeClasses, performanceSummary, performanceKey);
              });
            }
            if (nonPremiumClassIds.length) {
              this.performanceProvider.fetchCAPerformance(nonPremiumClassIds).then(performanceSummaryForDCA => {
                const performanceKey = 'performanceSummary';
                this.setPerformanceSummary(activeClasses, performanceSummaryForDCA, performanceKey);
              });
            }
            if (permiumClassSubjectIds.length) {
              this.competencyProvider.fetchCompetencyCompletionStats(permiumClassSubjectIds).then((competencyCompletionStats) => {
                const performanceKey = 'competencyStats';
                this.setPerformanceSummary(activeClasses, competencyCompletionStats, performanceKey);
              });
            }
          }, reject);
        }
        resolve(activeClasses);
      }, reject);
    });
  }

  /**
   * @function addTeacherToClass
   * Method is used to add teacher details to class
   */
  public addTeacherToClass(classes, teacherDetails) {
    return classes.map((classItem) => {
      classItem.teacher = teacherDetails.find((teacher) => {
        return teacher.id === classItem.creator_id;
      });
      return classItem;
    });
  }

  /**
   * @function fetchClassById
   * Method is used to fetch class by id
   */
  public fetchClassById(classId) {
    return this.classProvider.fetchClassById(classId);
  }

  /**
   * @function orderByMemberId
   * Method is used to order by member id
   */
  public orderByMemberId(classes, memberIds) {
    return classes.sort((class1, class2) => {
      return memberIds.indexOf(class1.id) - memberIds.indexOf(class2.id);
    });
  }

  /**
   * @function fetchClassMembers
   * Method is used to fetch class members
   */
  public fetchClassMembers(classId) {
    return new Promise((resolve, reject) => {
      this.classStoreSubscription = this.store.select(getClassMembersByClassId(classId))
        .subscribe((classMembers) => {
          if (!classMembers) {
            this.classProvider.fetchClassMembers(classId).then((result) => {
              this.store.dispatch(setClassMembers({ key: classId, data: result }));
            });
          } else {
            resolve(cloneObject(classMembers));
          }
        }, (error) => {
          reject(error);
        });
    });
  }

  /**
   * @function unSubscribeEvent
   * This Method is used to un subscribe the store event
   */
  public unSubscribeEvent() {
    if (this.classStoreSubscription) {
      this.classStoreSubscription.unsubscribe();
    }
  }

  /**
   * @function getListOfClassIds
   * Method to fetch class ids from the list of classes
   */
  public getListOfClassIds(activeClasses) {
    return activeClasses.map((activeClass) => {
      return activeClass.id;
    });
  }

  /**
   * @function getListOfClassSubCodeIds
   * Method to fetch class ids and subject code from the list of classes
   */
  public getListOfClassSubCodeIds(activeClasses) {
    const classesHasSubject = this.filterSubjectClasses(activeClasses);
    return classesHasSubject.map((activeClass) => {
      const subjectCode = activeClass.preference ? activeClass.preference.subject : null;
      const classSubjectIds = { classId: activeClass.id, subjectCode };
      return classSubjectIds;
    });
  }

  /**
   * @function filterSubjectClasses
   * Method is used to filter subject classes
   */
  public filterSubjectClasses(activeClasses) {
    return activeClasses.filter((subjectClass) => {
      return subjectClass.preference && subjectClass.preference.subject !== null && subjectClass.preference.subject !== '';
    });
  }

  public setClass(classData) {
    this.classSubject.next(classData);
  }

  public setClassTaxonomy(classTaxonomy) {
    this.classTaxonomySubject.next(classTaxonomy);
  }

  get class(): ClassModel {
    return this.classSubject ? this.classSubject.value : null;
  }

  get classTaxonomy(): TaxonomySubjectModel {
    return this.classTaxonomySubject ? this.classTaxonomySubject.value : null;
  }

  /**
   * @function fetchSkylineInitialState
   * Method is used to fetch state
   */
  public fetchSkylineInitialState(classId: string) {
    return this.classProvider.fetchSkylineInitialState(classId);
  }

  /**
   * @function setPerformanceSummary
   * Method to used to set performance summary for given classes
   */
  private setPerformanceSummary(activeClasses, performanceSummaryList, performanceKey) {
    activeClasses.map(activeClass => {
      if (!activeClass[performanceKey]) {
        const performance = performanceSummaryList.find((performanceSummary) => {
          return performanceSummary.classId === activeClass.id;
        });
        if (performance) {
          performance.scoreInPercentage = performance.scoreInPercentage || performance.score;
        }
        activeClass[performanceKey] = performance ? performance : null;
      }
      return activeClass;
    });
  }

  /**
   * @function getPremiumClasses
   * Method to get premium class
   */
  private getPremiumClasses(classes) {
    return classes.filter(classData => {
      return classData.isPremiumClass || classData.isPublic;
    });
  }

  /**
   * @function getNonPremiumClasses
   * Method to used to get non premium classes
   */
  private getNonPremiumClasses(classes) {
    return classes.filter(classData => {
      return !classData.isPremiumClass;
    });
  }

  /**
   * Retrieve the student active and premium classes
   */
  private getActiveClasses(classList) {
    const classes = classList.classes;
    if (classes && !classes.length) {
      return [];
    }
    return classes.filter((aClass) => {
      return !aClass.is_archived && classList.member.includes(aClass.id);
    });
  }
}
