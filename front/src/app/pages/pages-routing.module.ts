import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@core';
import { CoursesLayoutComponent } from '../theme/courses-layout/courses-layout.component';
import { ProfilsComponent } from './profils/profils.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'suivi',
        pathMatch: 'full',
      },
      {
        path: 'suivi/:id',
        component: CoursesLayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        loadChildren: () => import('../courses/courses.module').then(m => m.CoursesModule),
      },
      {
        path: 'profils',
        component: ProfilsComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
