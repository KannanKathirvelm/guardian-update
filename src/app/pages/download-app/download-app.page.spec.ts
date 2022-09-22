import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DownloadAppPage } from './download-app.page';

describe('DownloadAppPage', () => {
  let component: DownloadAppPage;
  let fixture: ComponentFixture<DownloadAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAppPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
