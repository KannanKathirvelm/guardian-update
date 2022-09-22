import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmailApprovalPage } from './email-approval.page';

describe('EmailApprovalPage', () => {
  let component: EmailApprovalPage;
  let fixture: ComponentFixture<EmailApprovalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailApprovalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailApprovalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
