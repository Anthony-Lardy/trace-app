import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '@data/models/course.interface';
import { StatService } from '@data/services/stat.service';
import { Stat } from '@data/models/stat.interface';
import { Observable, of } from 'rxjs';
import { Group } from '@data/models/group.interface';
import { CourseService } from '@data/services/course.service';
import { GroupService } from '@data/services/group.service';
import { toGroup } from '@data/models/group.dto';
import { toCourse } from '@data/models/course.dto';
import { map } from 'rxjs/operators';
import { Student } from '@data/models/student.interface';
import { Activity } from '@data/models/activity.interface';


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailComponent implements OnInit {

  public stat: Observable<any[]>;
  public course: Observable<Course> = of(toCourse({}));
  public group: Observable<Group> = of(toGroup({}));
  public displayedColumns: string[] = [];
  constructor(
    private route: ActivatedRoute,
    private statService: StatService,
    private courseService: CourseService,
    private groupService: GroupService,
    private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.route.params.subscribe(({ id }: { id: string }) => {

      if (id.includes('CRS')) {
        this.stat = this.statService.getStatByCourse(id).pipe(
          map((stat) => {
            this.displayedColumns = this.getDisplayColumn(stat);
            return this.computeStudentsStat(stat);
          })
        );
        this.course = this.courseService.getCourse(id);
        return;
      }

      this.group = this.groupService.getGroup(id);
      this.stat = this.statService.getStatByGroup(id).pipe(
        map((stat) => {
          this.displayedColumns = this.getDisplayColumn(stat);
          return this.computeStudentsStat(stat);
        })
      );
      this.group.subscribe(({ course }) => {
        this.course = this.courseService.getCourse(course);
      });
    });
  }

  public getDisplayColumn(stat: Stat) {
    return [
      'Nom',
      'Participation generale',
      ...this.getActivitiesType(stat),
      ...stat.activities.map(({ name }) => name),
    ];
  }

  public computeStudentsStat(stat: Stat) {
    return stat.students.map((student) => {
      const studentStat = {
        'Nom': student.firstName + ' ' + student.lastName,
        'Participation generale': (student.activities.length / stat.activities.length) * 100
      };

      for (const type of this.getActivitiesType(stat)) {
        const studentActivities = this.getUserActivitiesByType(student, stat.activities, type);
        studentStat[type] = (studentActivities.length / stat.activities.filter((activity) => activity.type === type).length) * 100;
      }

      for (const activity of stat.activities) {
        studentStat[activity.name] = student.activities.includes(activity.id) && ':)' || ':(';
      }

      return studentStat;

    });
  }

  public getActivitiesType(stat: Stat) {
    return stat.activities.reduce((acc, { type }) => {
      if (!acc.includes(type)) {
        acc.push(type);
      }
      return acc;
    }, [] as string[]);
  }

  public getUserActivitiesByType(student: Student & { activities: string[] }, activities: Activity[], type: string) {
    return activities.filter((activity) => student.activities.includes(activity.id) && activity.type === type);
  }
}
