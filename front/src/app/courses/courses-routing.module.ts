import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesComponent } from './courses/courses.component';



@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],

        runGuardsAndResolvers: 'always',
        children: [
          { path: '', component: CoursesComponent, pathMatch: 'full' },
          {
            path: 'general',
            component: DashboardComponent,
          },
          {
            path: 'detail',
            component: CourseDetailComponent,
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class CoursesRoutingModule { }
