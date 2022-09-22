import { Component } from '@angular/core';
import { fadeAnimation } from '@shared/animations';
import { collapseAnimation } from 'angular-animations';

@Component({
  selector: 'nav-guardian-description',
  templateUrl: './guardian-description.component.html',
  styleUrls: ['./guardian-description.component.scss'],
  animations: [collapseAnimation({ duration: 1000, delay: 300 }), fadeAnimation]
})

export class GuardianDescriptionComponent {

  // -------------------------------------------------------------------------
  // Properties

  public guardianDescriptionList: Array<{ icon: string; title: string; description: string }>;

  // -------------------------------------------------------------------------
  // Dependency Injection

  constructor() {
    this.guardianDescriptionList = [
      {
        icon: 'chart-line',
        title: 'Realtime Data on Your Student',
        description: 'Monitor your student’s growth in real time. Watch as they explore content, progress through their Learning Journey, and complete activities and assignments.'
      }, {
        icon: 'user-astronaut',
        title: 'Support Their Journey',
        description: 'Learn more about your student’s interests, preferences, strengths, and needs. Make additional suggestions to help guide them to their learning destination.'
      }, {
        icon: 'project-diagram',
        title: 'Fill in the Gaps',
        description: 'Every learner is unique. Gain access to in-depth information about your student’s progress and support them as they work towards their learning goals.'
      }
    ];
  }
}
