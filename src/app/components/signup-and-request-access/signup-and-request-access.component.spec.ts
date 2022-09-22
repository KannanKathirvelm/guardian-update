import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupAndRequestAccessComponent } from './signup-and-request-access.component';

describe('SignupAndRequestAccessComponent', () => {
  let component: SignupAndRequestAccessComponent;
  let fixture: ComponentFixture<SignupAndRequestAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupAndRequestAccessComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupAndRequestAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
