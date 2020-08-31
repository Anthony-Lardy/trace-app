import { Student } from "@core/student/student.interface";
import { Activity } from "@core/activity/activity.interface";

export interface StudentStat extends Student {
    activities: string[];
}
export interface Stat {
    students: StudentStat[];
    activities: Activity[];
}