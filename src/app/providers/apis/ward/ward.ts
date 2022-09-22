import { Injectable } from '@angular/core';
import { WardModel } from '@models/ward/ward';
import { HttpService } from '@providers/apis/http';
import { GuardianSessionService } from '@providers/service/session/session.service';
import { ROLES } from '@shared/constants/helper-constants';

@Injectable({
  providedIn: 'root'
})

export class WardProvider {

  // -------------------------------------------------------------------------
  // Properties

  private guardianNamespace = 'api/guardian/v1';

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private httpService: HttpService,
    private guardianSessionService: GuardianSessionService
  ) { }

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function fetchWardList
   * This method is used to fetch student list
   */
  public fetchWardList() {
    const guardianId = this.guardianSessionService.guardianUserSession.id;
    const endpoint = `${this.guardianNamespace}/gd-users/${guardianId}/users`;
    return this.httpService.get<Array<WardModel>>(endpoint).then((response) => {
      const normalizeStudentList = this.normalizeStudent(response.data.users);
      return this.sortbyName(normalizeStudentList);
    });
  }

  /**
   * @function sortbyName
   * This method is used to sort by name
   */
  private sortbyName(studentList) {
    return studentList.sort((student1, student2) => student1.first_name.toLowerCase() > student2.first_name.toLowerCase() ? 1 : -1);
  }

  /**
   * @function impersonateWard
   * This method is used to impersonate student
   */
  public impersonateWard(userId: string) {
    const endpoint = `${this.guardianNamespace}/gd-users/auth/impersonate`;
    const params = { userId };
    return this.httpService.post(endpoint, params).then((response) => {
      return response.data.accessToken;
    });
  }

  /**
   * @function inviteToStudent
   * This method is used to invite student
   */
  public inviteToStudent(emailId: string, relationshipId: number, token?: string) {
    const endpoint = `${this.guardianNamespace}/gd-users/invitees`;
    const params = { email: emailId, relationship_id: relationshipId };
    let reqOpts;
    if (token) {
      const headers = this.httpService.getTokenHeaders(token);
      reqOpts = { headers };
    }
    return this.httpService.post(endpoint, params, reqOpts);
  }

  /**
   * @function approveStudentRequest
   * This method is used to approve student request
   */
  public approveStudentRequest(studentId: string) {
    const endpoint = `${this.guardianNamespace}/gd-users/accept/users`;
    const params = { userId: studentId };
    return this.httpService.put(endpoint, params);
  }

  // -------------------------------------------------------------------------
  // normalie methods

  /**
   * @function normalizeStudent
   * This method is used to normalize student
   */
  private normalizeStudent(payload): Array<WardModel> {
    return payload.map((item) => {
      const student: WardModel = {
        classesCount: item.classesCount,
        first_name: item.firstname,
        gradeName: item.gradeName,
        last_name: item.lastname,
        tenantId: item.tenantId,
        thumbnail: item.thumbnail
          ? `${item.cdnUrls.userCdnUrl}${item.thumbnail}`
          : null,
        user_id: item.userId,
        username: item.username,
        schoolName: item.schoolName,
        inviteStatus: item.inviteStatus,
        isInvitedByStudent: item.invitedBy === ROLES.STUDENT,
        status: item.status,
        isImpersonate: false,
        tenantName: item.tenantName
      };
      return student;
    });
  }
}
