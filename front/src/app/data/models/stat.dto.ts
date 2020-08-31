import { StatHttp, Stat } from './stat.interface';
import { toStudent } from './student.dto';
import { toActivity } from './activity.dto';

export function toStat(stat: Partial<StatHttp>): Stat {
    return {
        students: (stat.students || []).map(({activities, ...student}) => ({
            ...toStudent(student),
            activities
        })),
        activities: (stat.activities || []).map(toActivity),
    };
}
