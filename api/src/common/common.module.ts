import { Global, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { conf, ConfigBucket } from './config-bucket';

@Global()
@Module({
    imports: [MongooseModule.forRoot(conf.MONGO_URL, { useFindAndModify: true })],
    providers: [
        { provide: ConfigBucket, useValue: conf },
        {
            provide: APP_PIPE, useFactory: () => {
                return new ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transform: true,
                });
            },
        },
    ],
    exports: [ConfigBucket],
})
export class CommonModule {
}
