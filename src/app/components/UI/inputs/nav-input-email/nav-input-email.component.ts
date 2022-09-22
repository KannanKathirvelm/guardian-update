import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'nav-input-email',
  templateUrl: './nav-input-email.component.html',
  styleUrls: ['./nav-input-email.component.scss'],
})
export class NavInputEmailComponent implements OnInit {

  // -------------------------------------------------------------------------
  // Properties

  @Input() public parentForm: FormGroup;
  @Input() public label: string;
  @Input() public isRequired: boolean;
  @Output() public enterEmail = new EventEmitter();
  @Input() public emailId: string;
  @Input() public formName: string;

  public ngOnInit() {
    this.formName = this.formName ?  this.formName : 'email';
  }

  // -------------------------------------------------------------------------
  // Actions

  /**
   * @function onEnterEmail
   * This method is triggered when email entered
   */
  public onEnterEmail() {
    this.enterEmail.emit();
  }
}
