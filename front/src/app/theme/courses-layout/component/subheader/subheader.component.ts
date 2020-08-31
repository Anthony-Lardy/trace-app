import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '@core';

@Component({
  selector: 'app-courses-header',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss']
})
export class SubHeaderComponent{
  constructor(public route: ActivatedRoute, public settings: SettingsService) {}

  public courseId =  this.route.snapshot.paramMap.get('id');
}

