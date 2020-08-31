import { User } from "@core/user/user.interface";
import { UserSession } from "@lib/helper";

export function fromUser(data: Partial<User>): UserSession {
    return {
        id: data.id || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
    };
}