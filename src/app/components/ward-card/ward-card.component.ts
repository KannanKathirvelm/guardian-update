import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WardModel } from '@models/ward/ward';

@Component({
  selector: 'nav-ward-card',
  templateUrl: './ward-card.component.html',
  styleUrls: ['./ward-card.component.scss'],
})

export class WardCardComponent {

  // -------------------------------------------------------------------------
  // Properties

  @Input() public student: WardModel;
  @Output() public openWardClassDetail = new EventEmitter();
  @Output() public approveStudentRequestEvent = new EventEmitter();

  // -------------------------------------------------------------------------
  // Methods

  /**
   * @function openStudentClass
   * Method to emit student class
   */
  public openStudentClass(student) {
    this.openWardClassDetail.emit(student);
  }

  /**
   * @function approveStudentRequest
   * Method to emit approve student request
   */
  public approveStudentRequest(studentId) {
    this.approveStudentRequestEvent.emit(studentId);
  }
}
