import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesComponent } from './courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoursesRoutingModule } from './courses-routing.module';
import { HighchartsChartComponent } from './courses/highcharts.component';

const COMPONENTS = [DashboardComponent, CourseDetailComponent, CoursesComponent, HighchartsChartComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    SharedModule,
    CoursesRoutingModule,
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class CoursesModule {}
