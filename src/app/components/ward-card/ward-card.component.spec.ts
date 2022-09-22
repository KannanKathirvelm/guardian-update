import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WardCardComponent } from './ward-card.component';

describe('WardCardComponent', () => {
  let component: WardCardComponent;
  let fixture: ComponentFixture<WardCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WardCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
