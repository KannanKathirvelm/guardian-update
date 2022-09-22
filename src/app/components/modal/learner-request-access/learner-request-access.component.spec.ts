import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LearnerRequestAccessComponent } from './learner-request-access.component';

describe('LearnerRequestAccessComponent', () => {
  let component: LearnerRequestAccessComponent;
  let fixture: ComponentFixture<LearnerRequestAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerRequestAccessComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LearnerRequestAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
