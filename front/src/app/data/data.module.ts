import { NgModule } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { CourseService } from './services/course.service';
import { GroupService } from './services/group.service';
import { StudentService } from './services/student.service';
import { StatService } from './services/stat.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        UserService,
        AuthService,
        CourseService,
        GroupService,
        StudentService,
        StatService,
    ],
})
export class DataModule { }
