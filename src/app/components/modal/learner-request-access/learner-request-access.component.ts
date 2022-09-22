import { Component } from '@angular/core';
import { ModalService } from '@providers/service/modal.service';

@Component({
  selector: 'app-learner-request-access',
  templateUrl: './learner-request-access.component.html',
  styleUrls: ['./learner-request-access.component.scss'],
})
export class LearnerRequestAccessComponent {

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor(
    private modalService: ModalService
  ) {}

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function dismissModal
   * Method to close modal
   */
  public dismissModal() {
    this.modalService.dismiss();
  }
}
