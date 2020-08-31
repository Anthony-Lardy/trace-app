import { UserSession } from '@lib/helper';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {

    public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const date = new Date().toISOString();
        const [{ user }] = context.getArgs<[{user?: UserSession}]>();
        const log = {
            level: 'info',
            message: `${context.getClass().name}:${context.getHandler().name}`,
            email: user?.email,
        };
        return next.handle().pipe(
            tap(
                () => {
                    Logger.log(date, JSON.stringify(log));
                },
                (error) => {
                    const message = error.message || '';
                    const code = error.status || '-1';
                    Logger.error(date, JSON.stringify({...log, level: 'error', code, error: message}));
                },
            ),
        );
    }

}
