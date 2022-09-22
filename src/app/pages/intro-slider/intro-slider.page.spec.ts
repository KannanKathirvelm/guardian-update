import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IntroSliderPage } from './intro-slider.page';

describe('IntroSliderPage', () => {
  let component: IntroSliderPage;
  let fixture: ComponentFixture<IntroSliderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroSliderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IntroSliderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
