import { Component, OnInit } from '@angular/core';
import { routes } from '../../consts/routes';
import { Course } from '@data/models/course.interface';
import { SettingsService } from '@core';
import { Group } from '@data/models/group.interface';
import { GroupService } from '@data/services/group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public routes: typeof routes = routes;
  public isOpenUiElements = false;
  public courses: Course[] & { groups: Group[] };

  constructor(public router: Router, private settings: SettingsService, private groupService: GroupService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  public openUiElements() {
    this.isOpenUiElements = !this.isOpenUiElements;
  }

  ngOnInit() {
    this.groupService.getGroups({
      filter: `course:(${this.settings.courses.map(({ id }) => id).join('|')})`
    }).subscribe((groups) => {
      this.courses = this.settings.courses.map((course: Course) => ({
        ...course,
        groups: groups.filter(({ course: courseId }) => courseId === course.id)
      }));
    });
  }
}
