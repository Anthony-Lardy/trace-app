import { NgModule } from '@angular/core';

import { HeaderModule } from './header/header.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SettingsMenuComponent } from './ui-elements/settings-menu/settings-menu.component';
import { DateMenuComponent } from './ui-elements/date-menu/date-menu.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SharedModule } from '@shared/shared.module';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { CoursesLayoutComponent } from './courses-layout/courses-layout.component';
import { SubHeaderComponent } from './courses-layout/component/subheader/subheader.component';



@NgModule({
  declarations: [
    SidebarComponent,
    StudentSidebarComponent,
    FooterComponent,
    SettingsMenuComponent,
    DateMenuComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    CoursesLayoutComponent,
    SubHeaderComponent
  ],
  imports: [
    SharedModule,
    HeaderModule,
  ],
  exports: [
    HeaderModule,
    SidebarComponent,
    FooterComponent,
    SettingsMenuComponent,
    DateMenuComponent,
  ]
})
export class ThemeModule { }
