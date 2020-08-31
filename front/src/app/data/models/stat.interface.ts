import { StudentHttp, Student } from './student.interface';
import { ActivityHttp, Activity } from './activity.interface';

export interface StatHttp {
    students: (StudentHttp & {
        activities: string[],
    })[];
    activities: ActivityHttp[];
}

export interface Stat {
    students: (Student & {
        activities: string[],
    })[];
    activities: Activity[];
}
